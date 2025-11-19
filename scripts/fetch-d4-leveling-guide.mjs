// scripts/fetch-d4-leveling-guide.mjs
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGE_DATA_URL =
  "https://d4builds.gg/page-data/leveling-guide/page-data.json";

// Basit slugify helper
function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// JSON içinden olası array path'lerini bulan helper
function findArrayCandidates(obj, pathArr = []) {
  const results = [];

  if (Array.isArray(obj)) {
    if (obj.length && typeof obj[0] === "object") {
      results.push({ path: pathArr, length: obj.length, sample: obj[0] });
    }
    return results;
  }

  if (obj && typeof obj === "object") {
    for (const [key, value] of Object.entries(obj)) {
      results.push(...findArrayCandidates(value, [...pathArr, key]));
    }
  }

  return results;
}

async function main() {
  console.log("📥 Fetching page-data:", PAGE_DATA_URL);

  const res = await fetch(PAGE_DATA_URL);
  if (!res.ok) {
    console.error("❌ HTTP error", res.status, res.statusText);
    process.exit(1);
  }

  const json = await res.json();

  // Olası array path'lerini tara
  const candidates = findArrayCandidates(json);
  console.log("🔍 Bulunan candidate array path'leri:");
  candidates.forEach((c, idx) => {
    console.log(
      `  [${idx}] ${c.path.join(".")} — length: ${c.length}`
    );
  });

  // Leveling guide için "class" ve "title"/"name" içeren bir array arayalım
  let selected = candidates.find((c) => {
    const s = c.sample || {};
    const hasClass = "class" in s || "class_en" in s || "diablo_class" in s;
    const hasTitle = "title" in s || "name" in s;
    const pathStr = c.path.join(".").toLowerCase();
    return (
      hasClass &&
      hasTitle &&
      (pathStr.includes("level") || pathStr.includes("guide"))
    );
  });

  // Bulamazsak fallback: "tierListData" tarzı özel path’lere bakabiliriz
  if (!selected) {
    selected = candidates.find((c) => {
      const s = c.sample || {};
      const hasTitle = "title" in s || "name" in s;
      return hasTitle;
    });
  }

  if (!selected) {
    console.error("❌ Uygun candidate array bulunamadı, path’e manuel bakmak lazım.");
    process.exit(1);
  }

  console.log(
    `\n✅ Seçilen path: ${selected.path.join(".")} — length: ${selected.length}`
  );
  console.log("🧪 Örnek kayıt:\n", selected.sample);

  // Seçilen path’e drill down
  let rawArray = json;
  for (const key of selected.path) {
    rawArray = rawArray[key];
  }

  if (!Array.isArray(rawArray)) {
    console.error(
      "❌ Seçilen path array değil. Tip:",
      typeof rawArray
    );
    process.exit(1);
  }

  // Normalize edilmiş leveling guide kaydı
  const mapped = rawArray.map((item, index) => {
    const title =
      item.title ||
      item.name ||
      item.buildName ||
      `Leveling Guide #${index + 1}`;

    const diabloClass =
      item.class ||
      item.class_en ||
      item.diablo_class ||
      item.d4Class ||
      null;

    const classKey = diabloClass
      ? String(diabloClass).toLowerCase()
      : null;

    const slugBase = item.slug || `${title}-${classKey || ""}`;
    const slug = slugify(slugBase);

    const season =
      item.season ||
      item.seasonNumber ||
      null;

    const difficulty =
      item.difficulty ||
      item.difficulty_label ||
      null;

    const tags = Array.isArray(item.tags)
      ? item.tags
      : Array.isArray(item.filters)
      ? item.filters
      : null;

    const description =
      Array.isArray(item.description) && item.description.length
        ? item.description.join("\n")
        : item.description ||
          item.summary ||
          null;

    return {
      slug,
      title_en: title,
      title_tr: null, // TR çeviri sonra
      diablo_class: diabloClass,
      class_key: classKey,
      season,
      difficulty,
      tags,
      description_en: description,
      description_tr: null,
      data: item, // ham data
    };
  });

  console.log(`\n📦 Toplam map'lenen leveling guide sayısı: ${mapped.length}`);

  const publicDir = path.join(__dirname, "..", "public", "data");
  await fs.mkdir(publicDir, { recursive: true });

  const rawPath = path.join(
    publicDir,
    "d4-leveling-guide-raw-page-data.json"
  );
  const mappedPath = path.join(
    publicDir,
    "d4-leveling-guide.json"
  );

  await fs.writeFile(rawPath, JSON.stringify(json, null, 2), "utf8");
  await fs.writeFile(mappedPath, JSON.stringify(mapped, null, 2), "utf8");

  console.log("💾 Ham page-data kaydedildi:", rawPath);
  console.log("💾 Normalize edilmiş leveling guide listesi kaydedildi:", mappedPath);
}

main().catch((err) => {
  console.error("❌ Hata:", err);
  process.exit(1);
});

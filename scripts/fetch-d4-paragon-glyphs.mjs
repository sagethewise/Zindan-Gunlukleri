// scripts/fetch-d4-paragon-glyphs.mjs
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGE_DATA_URL =
  "https://d4builds.gg/page-data/database/paragon-glyphs/page-data.json";

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

  const candidates = findArrayCandidates(json);
  console.log("🔍 Bulunan candidate array path'leri:");
  candidates.forEach((c, idx) => {
    console.log(
      `  [${idx}] ${c.path.join(".")} — length: ${c.length}`
    );
  });

  // Glyph verisi için "name" + muhtemelen "class" / "class_en" / "class_key" / "rarity" içeren array arıyoruz
  let selected = candidates.find((c) => {
    const s = c.sample || {};
    const hasName = "name" in s;
    const maybeClass =
      "class" in s || "class_en" in s || "class_key" in s || "diablo_class" in s;
    const pathStr = c.path.join(".").toLowerCase();
    return hasName && (maybeClass || pathStr.includes("glyph"));
  });

  if (!selected) {
    // Fallback: sadece "name" olan ilk array’i al
    selected = candidates.find((c) => {
      const s = c.sample || {};
      return "name" in s;
    });
  }

  if (!selected) {
    console.error("❌ Uygun candidate array bulunamadı, path’e manuel bakmak lazım.");
    process.exit(1);
  }

  console.log(
    `\n✅ Seçilen path: ${selected.path.join(".")} — length: ${selected.length}`
  );
  console.log("🧪 Örnek glyph:\n", selected.sample);

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

  const mapped = rawArray.map((item, index) => {
    const name = item.name || item.title || `Glyph #${index + 1}`;
    const slugBase = item.slug || name;
    const slug = slugify(slugBase);

    const diabloClass =
      item.class ||
      item.class_en ||
      item.class_key ||
      item.diablo_class ||
      null;

    const classKey = diabloClass ? String(diabloClass).toLowerCase() : null;

    const rarity =
      item.rarity ||
      item.tier ||
      null;

    const description =
      Array.isArray(item.description) && item.description.length
        ? item.description.join("\n")
        : item.description ||
          item.effect ||
          item.text ||
          null;

    const radius =
      item.radius ||
      item.range ||
      null;

    const tags = Array.isArray(item.tags)
      ? item.tags
      : Array.isArray(item.filters)
      ? item.filters
      : null;

    return {
      slug,
      name_en: name,
      name_tr: null, // TR çeviri sonra
      diablo_class: diabloClass,
      class_key: classKey,
      rarity,
      radius,
      tags,
      description_en: description,
      description_tr: null,
      data: item, // ham data
    };
  });

  console.log(`\n📦 Toplam map'lenen glyph sayısı: ${mapped.length}`);

  const publicDir = path.join(__dirname, "..", "public", "data");
  await fs.mkdir(publicDir, { recursive: true });

  const rawPath = path.join(
    publicDir,
    "d4-paragon-glyphs-raw-page-data.json"
  );
  const mappedPath = path.join(
    publicDir,
    "d4-paragon-glyphs.json"
  );

  await fs.writeFile(rawPath, JSON.stringify(json, null, 2), "utf8");
  await fs.writeFile(mappedPath, JSON.stringify(mapped, null, 2), "utf8");

  console.log("💾 Ham page-data kaydedildi:", rawPath);
  console.log("💾 Normalize edilmiş glyph listesi kaydedildi:", mappedPath);
}

main().catch((err) => {
  console.error("❌ Hata:", err);
  process.exit(1);
});

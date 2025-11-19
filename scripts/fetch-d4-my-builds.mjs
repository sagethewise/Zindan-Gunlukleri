// scripts/fetch-d4-my-builds.mjs
import fs from "node:fs/promises";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const PAGE_DATA_URL =
  "https://d4builds.gg/page-data/my-builds/page-data.json";

function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

  // ⬇⬇⬇ Artık global fetch kullanıyoruz
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

  // title / name / slug içeren ilk array’i seç
  let selected = candidates.find((c) => {
    const s = c.sample || {};
    return "title" in s || "name" in s || "slug" in s;
  });

  if (!selected) {
    console.error(
      "❌ Uygun candidate array bulunamadı, path'e manuel bakman gerekecek."
    );
    process.exit(1);
  }

  console.log(
    `\n✅ Seçilen path: ${selected.path.join(".")} — length: ${selected.length}`
  );
  console.log("🧪 Örnek build:\n", selected.sample);

  let rawArray = json;
  for (const key of selected.path) {
    rawArray = rawArray[key];
  }

  const mapped = rawArray.map((item, index) => {
    const title = item.title || item.name || `My Build #${index + 1}`;
    const slug = slugify(item.slug || title);
    const diabloClass =
      item.class ||
      item.diablo_class ||
      item.classKey ||
      item.class_key ||
      null;

    const season =
      typeof item.season === "number"
        ? item.season
        : parseInt(item.season ?? "0", 10) || null;

    const description =
      item.description ||
      (Array.isArray(item.summary) ? item.summary.join("\n") : item.summary) ||
      null;

    const tags = Array.isArray(item.tags)
      ? item.tags
      : Array.isArray(item.filters)
      ? item.filters
      : null;

    return {
      slug,
      title_en: title,
      title_tr: null, // TR çeviri için placeholder
      class_en: diabloClass,
      class_key: diabloClass ? String(diabloClass).toLowerCase() : null,
      diablo_class: diabloClass,
      season,
      mode: item.mode || item.type || null,
      build_id: item.id || item.buildId || null,
      description_en: description,
      description_tr: null, // TR çeviri için placeholder
      tags,
      data: item,
    };
  });

  console.log(`\n📦 Toplam map'lenen my-build sayısı: ${mapped.length}`);

  const publicDir = path.join(__dirname, "..", "public", "data");
  await fs.mkdir(publicDir, { recursive: true });

  const rawPath = path.join(publicDir, "d4-my-builds-raw-page-data.json");
  const mappedPath = path.join(publicDir, "d4-my-builds.json");

  await fs.writeFile(rawPath, JSON.stringify(json, null, 2), "utf8");
  await fs.writeFile(mappedPath, JSON.stringify(mapped, null, 2), "utf8");

  console.log("💾 Ham page-data kaydedildi:", rawPath);
  console.log("💾 Normalize edilmiş my-build listesi kaydedildi:", mappedPath);
}

main().catch((err) => {
  console.error("❌ Hata:", err);
  process.exit(1);
});

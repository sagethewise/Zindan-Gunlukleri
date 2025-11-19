// scripts/fetch-d4-runes.mjs
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGE_DATA_URL =
  "https://d4builds.gg/page-data/database/runes/page-data.json";

// Basit slug helper
function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// JSON içinde "array of objects" olan aday path'leri bul
function findArrayCandidates(obj, pathSegs = []) {
  const results = [];

  if (Array.isArray(obj)) {
    if (obj.length && typeof obj[0] === "object") {
      results.push({
        path: pathSegs,
        length: obj.length,
        sample: obj[0],
      });
    }
    return results;
  }

  if (obj && typeof obj === "object") {
    for (const [key, value] of Object.entries(obj)) {
      results.push(...findArrayCandidates(value, [...pathSegs, key]));
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

  // Runes için muhtemelen result.pageContext.runes benzeri bir şey;
  // ama generic olarak "name" ve muhtemelen "description" olan ilk array’i seçiyoruz.
  let selected = candidates.find((c) => {
    const s = c.sample || {};
    return "name" in s;
  });

  if (!selected) {
    console.error(
      "❌ Uygun candidate array bulunamadı, path’i konsolda inceleyip scriptte elle güncellemen gerekecek."
    );
    process.exit(1);
  }

  console.log(
    `\n✅ Seçilen path: ${selected.path.join(".")} — length: ${selected.length}`
  );
  console.log("🧪 Örnek rune:\n", selected.sample);

  let rawArray = json;
  for (const key of selected.path) {
    rawArray = rawArray[key];
  }

  // D4 runes → normalize
  const mapped = rawArray.map((item, index) => {
    const name = item.name || item.title || `Rune #${index + 1}`;
    const slug = slugify(name);

    const description =
      Array.isArray(item.description) && item.description.length
        ? item.description.join("\n")
        : item.description || item.effect || item.text || null;

    const tags =
      Array.isArray(item.tags) && item.tags.length
        ? item.tags
        : Array.isArray(item.filters) && item.filters.length
        ? item.filters
        : null;

    const runeType = item.type || item.category || null;

    return {
      slug,
      name_en: name,
      name_tr: null, // TR çeviri buraya eklenecek
      description_en: description,
      description_tr: null, // TR çeviri
      rune_type: runeType,
      tags,
      data: item, // full ham obje
    };
  });

  console.log(`\n📦 Toplam map'lenen rune sayısı: ${mapped.length}`);

  const publicDir = path.join(__dirname, "..", "public", "data");
  await fs.mkdir(publicDir, { recursive: true });

  const rawPath = path.join(publicDir, "d4-runes-raw-page-data.json");
  const mappedPath = path.join(publicDir, "d4-runes.json");

  await fs.writeFile(rawPath, JSON.stringify(json, null, 2), "utf8");
  await fs.writeFile(mappedPath, JSON.stringify(mapped, null, 2), "utf8");

  console.log("💾 Ham page-data kaydedildi:", rawPath);
  console.log("💾 Normalize edilmiş rune listesi kaydedildi:", mappedPath);
}

main().catch((err) => {
  console.error("❌ Hata:", err);
  process.exit(1);
});

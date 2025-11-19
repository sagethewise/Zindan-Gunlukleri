// scripts/fetch-d4-unique-loot-tables.mjs
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGE_DATA_URL =
  "https://d4builds.gg/page-data/database/unique-loot-tables/page-data.json";

// Basit slugify
function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Objede olası array’leri bulan küçük helper
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

  // Olası array path’lerini tara
  const candidates = findArrayCandidates(json);
  console.log("🔍 Bulunan candidate array path'leri:");
  candidates.forEach((c, idx) => {
    console.log(
      `  [${idx}] ${c.path.join(".")} — length: ${c.length}`
    );
  });

  // Unique loot table için "loot" veya "unique" geçen bir array arayalım
  let selected =
    candidates.find((c) => {
      const s = c.sample || {};
      const hasName = "name" in s || "boss" in s || "title" in s;
      const pathStr = c.path.join(".");
      return (
        hasName &&
        (pathStr.toLowerCase().includes("loot") ||
          pathStr.toLowerCase().includes("unique"))
      );
    }) || candidates[0]; // fallback: ilk candidate

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

  // Normalize et
  const mapped = rawArray.map((item, index) => {
    const bossName =
      item.boss ||
      item.name ||
      item.title ||
      item.source ||
      `Loot Table #${index + 1}`;

    const worldTier =
      item.worldTier ||
      item.world_tier ||
      item.tier ||
      null;

    // slug mümkünse item.slug, yoksa boss + worldTier
    const baseSlug = item.slug || bossName;
    const slug = slugify(
      worldTier ? `${baseSlug}-${worldTier}` : baseSlug
    );

    const diabloClass =
      item.class ||
      item.class_en ||
      item.diablo_class ||
      null;

    const classKey = diabloClass ? diabloClass.toLowerCase() : null;

    const location =
      item.location ||
      item.zone ||
      item.dungeon ||
      item.region ||
      null;

    const dropType =
      item.dropType ||
      item.type ||
      item.category ||
      null;

    const tags = Array.isArray(item.tags)
      ? item.tags
      : Array.isArray(item.filters)
      ? item.filters
      : null;

    return {
      slug,
      boss_en: bossName,
      boss_tr: null, // TR çeviri sonra
      diablo_class: diabloClass,
      class_key: classKey,
      world_tier: worldTier,
      location_en: location,
      location_tr: null,
      drop_type: dropType,
      tags,
      data: item, // ham veri
    };
  });

  console.log(`\n📦 Toplam map'lenen unique loot table sayısı: ${mapped.length}`);

  const publicDir = path.join(__dirname, "..", "public", "data");
  await fs.mkdir(publicDir, { recursive: true });

  const rawPath = path.join(
    publicDir,
    "d4-unique-loot-tables-raw-page-data.json"
  );
  const mappedPath = path.join(
    publicDir,
    "d4-unique-loot-tables.json"
  );

  await fs.writeFile(rawPath, JSON.stringify(json, null, 2), "utf8");
  await fs.writeFile(mappedPath, JSON.stringify(mapped, null, 2), "utf8");

  console.log("💾 Ham page-data kaydedildi:", rawPath);
  console.log("💾 Normalize edilmiş loot table listesi kaydedildi:", mappedPath);
}

main().catch((err) => {
  console.error("❌ Hata:", err);
  process.exit(1);
});

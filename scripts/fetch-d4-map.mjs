// scripts/fetch-d4-map.mjs
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ⛔ node-fetch kaldırıldı, çünkü fetch artık global

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGE_DATA_URL =
  "https://d4builds.gg/page-data/map/page-data.json";

// Basit slugify
function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// JSON içindeki array’leri bul
function findArrayCandidates(obj, currentPath = []) {
  const results = [];

  if (Array.isArray(obj)) {
    if (obj.length && typeof obj[0] === "object") {
      results.push({ path: currentPath, length: obj.length, sample: obj[0] });
    }
    return results;
  }

  if (obj && typeof obj === "object") {
    for (const [key, value] of Object.entries(obj)) {
      results.push(...findArrayCandidates(value, [...currentPath, key]));
    }
  }

  return results;
}

async function main() {
  console.log("📥 Fetching page-data:", PAGE_DATA_URL);

  // Global fetch kullanılıyor
  const res = await fetch(PAGE_DATA_URL);

  if (!res.ok) {
    console.error("❌ HTTP ERROR", res.status, res.statusText);
    process.exit(1);
  }

  const json = await res.json();

  // Ham JSON’u kaydet
  const publicDir = path.join(__dirname, "..", "public", "data");
  await fs.mkdir(publicDir, { recursive: true });

  const rawPath = path.join(publicDir, "d4-map-raw-page-data.json");
  await fs.writeFile(rawPath, JSON.stringify(json, null, 2), "utf8");

  console.log("💾 Ham page-data kaydedildi:", rawPath);

  // Candidate array’leri bul
  const candidates = findArrayCandidates(json);
  console.log("🔍 Bulunan candidate array path'leri:");
  candidates.forEach((c, idx) => {
    console.log(`  [${idx}] ${c.path.join(".")} — length: ${c.length}`);
  });

  if (!candidates.length) {
    console.error("❌ Hiç array bulunamadı!");
    process.exit(1);
  }

  // 1) x/y koordinatı içeren array varsa onu seç
  let selected =
    candidates.find((c) => {
      const s = c.sample || {};
      return typeof s.x === "number" && typeof s.y === "number";
    }) ||
    // 2) name/title/label içeren array
    candidates.find((c) => {
      const s = c.sample || {};
      return "name" in s || "title" in s || "label" in s;
    }) ||
    candidates[0];

  console.log(
    `\n✅ Seçilen path: ${selected.path.join(".")} — length: ${selected.length}`
  );
  console.log("🧪 Örnek kayıt:", selected.sample);

  // Path'e in
  let rawArray = json;
  for (const key of selected.path) {
    rawArray = rawArray[key];
  }

  if (!Array.isArray(rawArray)) {
    console.error("❌ Array değil! Path:", selected.path);
    process.exit(1);
  }

  const mapped = rawArray.map((item, index) => {
    const name =
      item.name || item.title || item.label || `Map Node #${index + 1}`;

    const slug = slugify(
      name + "-" + (item.zone || item.region || item.area || "")
    );

    const zone = item.zone || item.region || item.area || null;

    return {
      slug,
      name_en: name,
      name_tr: null,
      zone_en: zone,
      zone_tr: null,
      description_en: item.description || null,
      description_tr: null,
      category: item.category || item.type || null,
      x: typeof item.x === "number" ? item.x : null,
      y: typeof item.y === "number" ? item.y : null,
      tags: Array.isArray(item.tags) ? item.tags : null,
      data: item,
    };
  });

  console.log(`\n📦 Toplam map'lenen node sayısı: ${mapped.length}`);

  const mappedPath = path.join(publicDir, "d4-map-nodes.json");
  await fs.writeFile(mappedPath, JSON.stringify(mapped, null, 2), "utf8");

  console.log("💾 Normalize edilmiş map nodes kaydedildi:", mappedPath);
}

main().catch((err) => {
  console.error("❌ Hata:", err);
  process.exit(1);
});

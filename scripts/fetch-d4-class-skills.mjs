// scripts/fetch-d4-class-skills.mjs
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGE_DATA_URL =
  "https://d4builds.gg/page-data/database/class-skills/page-data.json";

// basit slugify
function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// JSON içindeki olası array’leri bulmak için helper
function findArrayCandidates(obj, pathArr = []) {
  const results = [];

  if (Array.isArray(obj)) {
    if (obj.length && typeof obj[0] === "object") {
      results.push({
        path: pathArr,
        length: obj.length,
        sample: obj[0],
      });
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

function pickResource(item) {
  const map = [
    ["fury", "fury_generate"],
    ["spirit", "spirit_generate"],
    ["essence", "essence_generate"],
    ["energy", "energy_generate"],
    ["mana", "mana_generate"],
  ];

  for (const [type, key] of map) {
    if (key in item) {
      return {
        resource_type: type,
        resource_generate: item[key],
      };
    }
  }
  return { resource_type: null, resource_generate: null };
}

async function main() {
  console.log("📥 Fetching page-data:", PAGE_DATA_URL);

  const res = await fetch(PAGE_DATA_URL); // Node 18+ global fetch
  if (!res.ok) {
    console.error("❌ HTTP error", res.status, res.statusText);
    process.exit(1);
  }

  const json = await res.json();

  // Olası array path’lerini logla
  const candidates = findArrayCandidates(json);
  console.log("🔍 Bulunan candidate array path'leri:");
  candidates.forEach((c, idx) => {
    console.log(`  [${idx}] ${c.path.join(".")} — length: ${c.length}`);
  });

  // class-skills’de beklediğimiz array: result.pageContext.skills
  let selected =
    candidates.find((c) => c.path.join(".") === "result.pageContext.skills") ||
    candidates.find((c) => "name" in (c.sample || {}));

  if (!selected) {
    console.error("❌ Uygun candidate array bulunamadı.");
    process.exit(1);
  }

  console.log(
    `\n✅ Seçilen path: ${selected.path.join(".")} — length: ${selected.length}`
  );
  console.log("🧪 Örnek skill:\n", selected.sample);

  // Seçilen path’e yürüyüp gerçek array’i al
  let rawArray = json;
  for (const key of selected.path) {
    rawArray = rawArray[key];
  }

  const mapped = rawArray.map((item, index) => {
    const name = item.name || `Skill #${index + 1}`;
    const classEn = item.class || null;
    const classKey = classEn ? String(classEn).toLowerCase() : null;
    const slug = slugify(`${classKey || "any"}-${name}`);

    const { resource_type, resource_generate } = pickResource(item);

    const description_en = Array.isArray(item.description)
      ? item.description.join("\n")
      : null;

    const extra_en = Array.isArray(item.extra) ? item.extra : null;

    const values = {};
    for (const [k, v] of Object.entries(item)) {
      if (/^value[0-9]+$/.test(k) && Array.isArray(v)) {
        values[k] = v;
      }
    }

    const runes = Array.isArray(item.runes)
      ? item.runes.map((r) => ({
          name_en: r.name || null,
          name_tr: null,
          description_en: Array.isArray(r.description)
            ? r.description.join("\n")
            : null,
          description_tr: null,
        }))
      : null;

    return {
      slug,
      name_en: name,
      name_tr: null,
      class_en: classEn,
      class_key: classKey,
      tags: Array.isArray(item.tags) ? item.tags : null,
      filters: Array.isArray(item.filters) ? item.filters : null,
      resource_type,
      resource_generate,
      lucky_hit: item.lucky_hit || null,
      description_en,
      description_tr: null,
      extra_en,
      extra_tr: null,
      values: Object.keys(values).length ? values : null,
      runes,
      data: item, // orijinal nesneyi jsonb’de saklıyoruz
    };
  });

  console.log(`\n📦 Toplam map'lenen skill sayısı: ${mapped.length}`);

  const publicDir = path.join(__dirname, "..", "public", "data");
  await fs.mkdir(publicDir, { recursive: true });

  const rawPath = path.join(
    publicDir,
    "d4-class-skills-raw-page-data.json"
  );
  const mappedPath = path.join(publicDir, "d4-class-skills.json");

  await fs.writeFile(rawPath, JSON.stringify(json, null, 2), "utf8");
  await fs.writeFile(mappedPath, JSON.stringify(mapped, null, 2), "utf8");

  console.log("💾 Ham page-data kaydedildi:", rawPath);
  console.log("💾 Normalize edilmiş skill listesi kaydedildi:", mappedPath);
}

main().catch((err) => {
  console.error("❌ Hata:", err);
  process.exit(1);
});

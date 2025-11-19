// scripts/fetch-d4-uniques.mjs
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGE_DATA_URL =
  "https://d4builds.gg/page-data/database/uniques/page-data.json";

// basit slugify
function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// İçerideki array’leri bulmak için helper
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

  const res = await fetch(PAGE_DATA_URL);
  if (!res.ok) {
    console.error("❌ HTTP error", res.status, res.statusText);
    process.exit(1);
  }

  const json = await res.json();

  // Olası array path’lerini göster
  const candidates = findArrayCandidates(json);
  console.log("🔍 Bulunan candidate array path'leri:");
  candidates.forEach((c, idx) => {
    console.log(
      `  [${idx}] ${c.path.join(".")} — length: ${c.length}`
    );
  });

  // Daha önce bildiğimiz path: result.pageContext.uniques / uniquesPTR
  // Önce tam olarak bunu dene:
  let rawArray =
    json?.result?.pageContext?.uniques ??
    json?.result?.pageContext?.uniquesPTR ??
    null;

  if (!rawArray || !Array.isArray(rawArray) || rawArray.length === 0) {
    // fallback: "name" ve "class" içeren ilk array’i yakala
    const selected = candidates.find((c) => {
      const s = c.sample || {};
      return "name" in s && "class" in s;
    });

    if (!selected) {
      console.error("❌ Uygun candidate array bulunamadı, path’e manuel bakmak lazım.");
      process.exit(1);
    }

    console.log(
      `\n✅ Fallback seçilen path: ${selected.path.join(".")} — length: ${selected.length}`
    );
    console.log("🧪 Örnek unique:\n", selected.sample);

    rawArray = json;
    for (const key of selected.path) {
      rawArray = rawArray[key];
    }
  } else {
    console.log(
      `\n✅ Seçilen path: result.pageContext.${
        json?.result?.pageContext?.uniques ? "uniques" : "uniquesPTR"
      } — length: ${rawArray.length}`
    );
    console.log("🧪 Örnek unique:\n", rawArray[0]);
  }

  const mapped = rawArray.map((item, index) => {
    const name = item.name || `Unique #${index + 1}`;
    const slug = slugify(name);
    const classKey = item.class ? item.class.toLowerCase() : null;

    // d4builds’te isimler böyleydi:
    // secondary_stats, terciary_stats, terciary_stats__full, effect, flavor
    const secondaryStats = Array.isArray(item.secondary_stats)
      ? item.secondary_stats
      : null;

    const tertiaryStats =
      Array.isArray(item.terciary_stats) || Array.isArray(item.tertiary_stats)
        ? item.terciary_stats ?? item.tertiary_stats
        : null;

    const tertiaryStatsFull = Array.isArray(item.terciary_stats__full)
      ? item.terciary_stats__full
      : null;

    const tags = Array.isArray(item.tags) ? item.tags : null;

    return {
      slug,
      name_en: name,
      name_tr: null, // TR çevirileri için boş
      class_en: item.class ?? null,
      class_key: classKey,
      type: item.type ?? null,
      slot_key: item.slot_key ?? null, // varsa
      world_tier: item.world_tier ?? null,
      boss: item.boss ?? null,
      drop_type: item.drop_type ?? null,
      // stats
      secondary_stats_en: secondaryStats,
      secondary_stats_tr: null,
      tertiary_stats_en: tertiaryStats,
      tertiary_stats_full_en: tertiaryStatsFull,
      tertiary_stats_tr: null,
      // yazı alanları
      effect_en: item.effect ?? null,
      effect_tr: null,
      flavor_en: item.flavor ?? null,
      flavor_tr: null,
      tags,
      data: item, // orijinal JSON burada
    };
  });

  console.log(`\n📦 Toplam map'lenen unique sayısı: ${mapped.length}`);

  const publicDir = path.join(__dirname, "..", "public", "data");
  await fs.mkdir(publicDir, { recursive: true });

  const rawPath = path.join(publicDir, "d4-uniques-raw-page-data.json");
  const mappedPath = path.join(publicDir, "d4-uniques.json");

  await fs.writeFile(rawPath, JSON.stringify(json, null, 2), "utf8");
  await fs.writeFile(mappedPath, JSON.stringify(mapped, null, 2), "utf8");

  console.log("💾 Ham page-data kaydedildi:", rawPath);
  console.log("💾 Normalize edilmiş unique listesi kaydedildi:", mappedPath);
}

main().catch((err) => {
  console.error("❌ Hata:", err);
  process.exit(1);
});

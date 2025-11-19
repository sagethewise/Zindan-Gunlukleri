// scripts/fetch-d4-chaos-perks.mjs
import fs from "node:fs/promises";
import path from "node:path";
import url from "node:url";

// Node ESM'de __dirname üretimi
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const PAGE_DATA_URL =
  "https://d4builds.gg/page-data/database/chaos-perks/page-data.json";

// Basit slugify
function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// JSON içinde array candidate’ları bulmak için yardımcı
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

  // 1) Önce muhtemel path’leri direkt dene (paragon’da yaptığımız gibi)
  const preferredPaths = [
    ["result", "pageContext", "chaosPerks"],
    ["result", "pageContext", "chaos_perks"],
  ];

  let rawArray = null;
  let selectedPath = null;

  for (const p of preferredPaths) {
    let cur = json;
    let ok = true;
    for (const key of p) {
      if (cur && typeof cur === "object" && key in cur) {
        cur = cur[key];
      } else {
        ok = false;
        break;
      }
    }
    if (ok && Array.isArray(cur)) {
      rawArray = cur;
      selectedPath = p;
      break;
    }
  }

  // 2) Hâlâ bulamadıysak, generic candidate taramasına dön
  if (!rawArray) {
    const candidates = findArrayCandidates(json);
    console.log("🔍 Bulunan candidate array path'leri:");
    candidates.forEach((c, idx) => {
      console.log(
        `  [${idx}] ${c.path.join(".")} — length: ${c.length}`
      );
    });

    // İçinde "chaos" geçen path'i tercih et, yoksa ilk candidate
    let chosen =
      candidates.find((c) =>
        c.path.join(".").toLowerCase().includes("chaos")
      ) || candidates[0];

    if (!chosen) {
      console.error("❌ Uygun candidate array bulunamadı, JSON yapısına yeniden bakmak lazım.");
      process.exit(1);
    }

    selectedPath = chosen.path;
    rawArray = (() => {
      let cur = json;
      for (const key of chosen.path) {
        cur = cur[key];
      }
      return cur;
    })();

    console.log(
      `\n✅ Seçilen path (fallback): ${selectedPath.join(".")} — length: ${
        Array.isArray(rawArray) ? rawArray.length : 0
      }`
    );
    console.log("🧪 Örnek perk:\n", chosen.sample);
  } else {
    console.log(
      `\n✅ Seçilen path: ${selectedPath.join(".")} — length: ${rawArray.length}`
    );
    if (rawArray.length) {
      console.log("🧪 Örnek perk:\n", rawArray[0]);
    }
  }

  if (!Array.isArray(rawArray)) {
    console.error("❌ Seçilen path array değil, script'i güncellemek gerekiyor.");
    process.exit(1);
  }

  // 3) Normalize et
  const mapped = rawArray.map((item, index) => {
    const name = item.name || item.title || `Chaos Perk #${index + 1}`;
    const slug = slugify(name);

    const description =
      Array.isArray(item.description) && item.description.length
        ? item.description.join("\n")
        : item.effect || item.text || null;

    return {
      slug,
      name_en: name,
      name_tr: null,
      description_en: description,
      description_tr: null,
      category: item.category || item.type || null,
      tags: Array.isArray(item.tags) ? item.tags : null,
      data: item,
    };
  });

  console.log(`\n📦 Toplam map'lenen chaos perk sayısı: ${mapped.length}`);

  const publicDir = path.join(__dirname, "..", "public", "data");
  await fs.mkdir(publicDir, { recursive: true });

  const rawPath = path.join(publicDir, "d4-chaos-perks-raw-page-data.json");
  const mappedPath = path.join(publicDir, "d4-chaos-perks.json");

  await fs.writeFile(rawPath, JSON.stringify(json, null, 2), "utf8");
  await fs.writeFile(mappedPath, JSON.stringify(mapped, null, 2), "utf8");

  console.log("💾 Ham page-data kaydedildi:", rawPath);
  console.log("💾 Normalize edilmiş chaos perk listesi kaydedildi:", mappedPath);
}

main().catch((err) => {
  console.error("❌ Hata:", err);
  process.exit(1);
});

// scripts/fetch-d4-tierlist.mjs
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGE_DATA_URL =
  "https://d4builds.gg/page-data/tierlist/page-data.json";

function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  console.log("📥 Fetching page-data:", PAGE_DATA_URL);

  const res = await fetch(PAGE_DATA_URL);
  if (!res.ok) {
    console.error("❌ HTTP error", res.status, res.statusText);
    process.exit(1);
  }

  const json = await res.json();

  // 👉 Artık candidate aramıyoruz, doğrudan:
  // result.pageContext.tierListData
  const arrayPath = ["result", "pageContext", "tierListData"];

  let rawArray = json;
  for (const key of arrayPath) {
    if (!rawArray || !(key in rawArray)) {
      console.error("❌ Beklenen path bulunamadı:", arrayPath.join("."));
      console.error("Elimizdeki current segment:", key, rawArray);
      process.exit(1);
    }
    rawArray = rawArray[key];
  }

  if (!Array.isArray(rawArray)) {
    console.error(
      "❌ result.pageContext.tierListData bir array değil gibi görünüyor."
    );
    console.error("Tip:", typeof rawArray);
    process.exit(1);
  }

  console.log(
    `✅ Tier list array bulundu. Kayıt sayısı: ${rawArray.length}`
  );
  console.log("🧪 Örnek kayıt:", rawArray[0]);

  // Normalize et
  const mapped = rawArray.map((item, index) => {
    const title = item.title || item.name || `Tierlist Build #${index + 1}`;
    const slug = item.slug || item.path || slugify(title);

    // Muhtemel alan adlarını esnek kullanalım
    const diabloClass =
      item.class ||
      item.class_en ||
      item.className ||
      item.diablo_class ||
      null;

    const classKey = diabloClass ? diabloClass.toLowerCase() : null;

    const mode =
      item.mode || item.category || item.buildType || item.type || null;

    const role = item.role || item.playstyle || null;
    const tier = item.tier || item.rank || null;

    const score =
      typeof item.score === "number"
        ? item.score
        : typeof item.points === "number"
        ? item.points
        : null;

    const isMeta =
      typeof item.isMeta === "boolean"
        ? item.isMeta
        : typeof item.meta === "boolean"
        ? item.meta
        : null;

    const tags = Array.isArray(item.tags)
      ? item.tags
      : Array.isArray(item.filters)
      ? item.filters
      : null;

    return {
      slug,
      title_en: title,
      title_tr: null, // TR çeviri sonra
      diablo_class: diabloClass,
      class_key: classKey,
      mode,
      role,
      tier,
      score,
      is_meta: isMeta,
      tags,
      data: item,
    };
  });

  console.log(`\n📦 Toplam map'lenen tierlist kayıt sayısı: ${mapped.length}`);

  const publicDir = path.join(__dirname, "..", "public", "data");
  await fs.mkdir(publicDir, { recursive: true });

  const rawPath = path.join(publicDir, "d4-tierlist-raw-page-data.json");
  const mappedPath = path.join(publicDir, "d4-tierlist.json");

  await fs.writeFile(rawPath, JSON.stringify(json, null, 2), "utf8");
  await fs.writeFile(mappedPath, JSON.stringify(mapped, null, 2), "utf8");

  console.log("💾 Ham page-data kaydedildi:", rawPath);
  console.log("💾 Normalize edilmiş tierlist kaydedildi:", mappedPath);
}

main().catch((err) => {
  console.error("❌ Hata:", err);
  process.exit(1);
});

// scripts/fetch-d4-paragon-boards.mjs
import fs from "node:fs/promises";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const PAGE_DATA_URL =
  "https://d4builds.gg/page-data/database/paragon-boards/page-data.json";

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

  // Node 18+ native fetch
  const res = await fetch(PAGE_DATA_URL);

  if (!res.ok) {
    console.error("❌ HTTP error", res.status, res.statusText);
    process.exit(1);
  }

  const json = await res.json();

  // 👇 DİREKT BİLDİĞİMİZ PATH: result.pageContext.paragonBoards
  const boards =
    json?.result?.pageContext?.paragonBoards ||
    json?.result?.pageContext?.paragonBoardsPTR ||
    [];

  if (!Array.isArray(boards) || boards.length === 0) {
    console.error(
      "❌ paragonBoards array'i bulunamadı ya da boş. Lütfen JSON'u inspect et."
    );
    process.exit(1);
  }

  console.log("✅ Bulunan paragonBoards length:", boards.length);
  console.log("🧪 Örnek board:\n", boards[0]);

  // Map'leme
  const mapped = boards.map((item, index) => {
    const name =
      item.name ||
      item.title ||
      item.boardName ||
      `Paragon Board #${index + 1}`;

    const slug = slugify(name);

    const klass =
      item.class ||
      item.heroClass ||
      item.className ||
      null;

    const description =
      Array.isArray(item.description) && item.description.length
        ? item.description.join("\n")
        : item.effect || item.text || null;

    const tags = Array.isArray(item.tags) ? item.tags : null;

    return {
      slug,
      name_en: name,
      name_tr: null,
      class_en: klass,
      class_key: klass ? klass.toLowerCase() : null,
      rarity: item.rarity || item.quality || "Legendary",
      description_en: description,
      description_tr: null,
      tags,
      data: item, // ham kayıt
    };
  });

  console.log(`\n📦 Toplam map'lenen board sayısı: ${mapped.length}`);

  const outDir = path.join(__dirname, "..", "public", "data");
  await fs.mkdir(outDir, { recursive: true });

  const rawPath = path.join(
    outDir,
    "d4-paragon-boards-raw-page-data.json"
  );
  const mappedPath = path.join(outDir, "d4-paragon-boards.json");

  await fs.writeFile(rawPath, JSON.stringify(json, null, 2), "utf8");
  await fs.writeFile(mappedPath, JSON.stringify(mapped, null, 2), "utf8");

  console.log("💾 Ham page-data kaydedildi:", rawPath);
  console.log("💾 Normalize edilmiş board listesi kaydedildi:", mappedPath);
}

main().catch((err) => {
  console.error("❌ Hata:", err);
  process.exit(1);
});

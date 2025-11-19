// scripts/fetch-d4-legendary-aspects.mjs
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGE_DATA_URL =
  "https://d4builds.gg/page-data/database/legendary-aspects/page-data.json";

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

async function main() {
  console.log("📥 Fetching page-data:", PAGE_DATA_URL);

  const res = await fetch(PAGE_DATA_URL); // 🔹 Node 18+ global fetch
  if (!res.ok) {
    console.error("❌ HTTP error", res.status, res.statusText);
    process.exit(1);
  }

  const json = await res.json();

  // Olası array path’lerini loglayalım:
  const candidates = findArrayCandidates(json);
  console.log("🔍 Bulunan candidate array path'leri:");
  candidates.forEach((c, idx) => {
    console.log(
      `  [${idx}] ${c.path.join(".")} — length: ${c.length}`
    );
  });

  // Aspects için genelde name içeren array’i alıyoruz
  let selected = candidates.find((c) => "name" in (c.sample || {}));

  if (!selected) {
    console.error(
      "❌ Uygun candidate array bulunamadı, path’e manuel bakmak gerekir."
    );
    process.exit(1);
  }

  console.log(
    `\n✅ Seçilen path: ${selected.path.join(".")} — length: ${selected.length}`
  );
  console.log("🧪 Örnek aspect:\n", selected.sample);

  // Seçilen path’e yürüyüp gerçek array’i al
  let rawArray = json;
  for (const key of selected.path) {
    rawArray = rawArray[key];
  }

  const mapped = rawArray.map((item, index) => {
    const name = item.name || item.title || `Legendary Aspect #${index + 1}`;

    const classRaw = item.class || item.class_key || null;
    const classKey = classRaw ? String(classRaw).toLowerCase() : "any";

    const slug = slugify(`${classKey}-${name}`);

    const description =
      Array.isArray(item.description) && item.description.length
        ? item.description.join("\n")
        : item.effect || item.text || null;

    // filters veya tags varsa tags’e atıyoruz
    const tagsSource = item.filters || item.tags;

    return {
      slug,                 // unique key (class + name)
      name_en: name,
      name_tr: null,        // TR çeviri için boş bırakıyoruz
      class_en: classRaw,
      class_key: classKey === "any" ? null : classKey,
      category: item.category || item.type || null, // Offensive / Defensive vs.
      description_en: description,
      description_tr: null,
      tags: Array.isArray(tagsSource) ? tagsSource : null,
      data: item,           // tam orijinal JSON objesi (jsonb)
    };
  });

  console.log(`\n📦 Toplam map'lenen legendary aspect sayısı: ${mapped.length}`);

  const publicDir = path.join(__dirname, "..", "public", "data");
  await fs.mkdir(publicDir, { recursive: true });

  const rawPath = path.join(
    publicDir,
    "d4-legendary-aspects-raw-page-data.json"
  );
  const mappedPath = path.join(
    publicDir,
    "d4-legendary-aspects.json"
  );

  await fs.writeFile(rawPath, JSON.stringify(json, null, 2), "utf8");
  await fs.writeFile(mappedPath, JSON.stringify(mapped, null, 2), "utf8");

  console.log("💾 Ham page-data kaydedildi:", rawPath);
  console.log("💾 Normalize edilmiş legendary aspects listesi kaydedildi:", mappedPath);
}

main().catch((err) => {
  console.error("❌ Hata:", err);
  process.exit(1);
});

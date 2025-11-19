// scripts/fetch-d4-creator-builds.mjs
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CLI arg: node scripts/fetch-d4-creator-builds.mjs rob2628
const creatorSlug = process.argv[2] || "rob2628";

const PAGE_DATA_URL = `https://d4builds.gg/page-data/${creatorSlug}/builds/page-data.json`;

function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// JSON içindeki tüm array candidate’lerini bul
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
  console.log("📥 Fetching creator builds:", PAGE_DATA_URL);

  const res = await fetch(PAGE_DATA_URL);
  if (!res.ok) {
    console.error("❌ HTTP error", res.status, res.statusText);
    process.exit(1);
  }

  const json = await res.json();

  // 1) Candidate array’leri listele
  const candidates = findArrayCandidates(json);
  console.log("🔍 Bulunan candidate array path'leri:");
  candidates.forEach((c, idx) => {
    console.log(
      `  [${idx}] ${c.path.join(".")} — length: ${c.length}`
    );
  });

  // 2) İçinde buildid geçen ilk array’i seç
  let selected = candidates.find((c) => {
    const s = c.sample || {};
    return (
      "buildid" in s ||
      (("name" in s || "class" in s) && Array.isArray(s.skills))
    );
  });

  if (!selected) {
    console.error(
      "❌ Uygun candidate array bulunamadı, path’e manuel bakmak lazım."
    );
    process.exit(1);
  }

  console.log(
    `\n✅ Seçilen path: ${selected.path.join(".")} — length: ${selected.length}`
  );
  console.log("🧪 Örnek build:\n", selected.sample);

  // 3) Seçilen path’e gidip asıl array’i çıkar
  let rawArray = json;
  for (const key of selected.path) {
    rawArray = rawArray[key];
  }

  if (!Array.isArray(rawArray)) {
    console.error("❌ Seçilen path array değil, tekrar bakmak lazım.");
    process.exit(1);
  }

  console.log("🧮 Bulunan build sayısı:", rawArray.length);

  // 4) Normalize et
  const normalized = rawArray.map((b, idx) => {
    const name = b.name || `Build #${idx + 1}`;
    const slug = slugify(`${name}-${b.class || ""}`);

    return {
      build_id: b.buildid || null,
      name_en: name,
      name_tr: null,

      creator_name: b.cc || creatorSlug,
      creator_slug: creatorSlug,

      class_en: b.class || null,
      class_key: b.class ? String(b.class).toLowerCase() : null,

      content_type: b.content || null, // "Endgame", "Leveling" vs
      season: typeof b.season === "number" ? b.season : null,
      tier: typeof b.tier === "number" ? b.tier : null,
      pit_level: typeof b.pit === "number" ? b.pit : null,

      skills_en: Array.isArray(b.skills)
        ? b.skills.map((s) => s.name).filter(Boolean)
        : null,
      skills_tr: null,

      raw: b,
      slug,
    };
  });

  const publicDir = path.join(__dirname, "..", "public", "data");
  await fs.mkdir(publicDir, { recursive: true });

  const rawPath = path.join(
    publicDir,
    `d4-creator-${creatorSlug}-builds-raw.json`
  );
  const normalizedPath = path.join(
    publicDir,
    `d4-creator-${creatorSlug}-builds.json`
  );

  await fs.writeFile(rawPath, JSON.stringify(json, null, 2), "utf8");
  await fs.writeFile(
    normalizedPath,
    JSON.stringify(normalized, null, 2),
    "utf8"
  );

  console.log("💾 Ham page-data kaydedildi:", rawPath);
  console.log("💾 Normalize edilmiş creator build listesi kaydedildi:", normalizedPath);
}

main().catch((err) => {
  console.error("❌ Hata:", err);
  process.exit(1);
});

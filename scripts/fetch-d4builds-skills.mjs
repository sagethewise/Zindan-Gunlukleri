// scripts/fetch-d4builds-skills.mjs
import fs from "node:fs";
import path from "node:path";
import https from "node:https";

const PAGE_DATA_URL =
  "https://d4builds.gg/page-data/database/class-skills/page-data.json";

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (err) {
            reject(err);
          }
        });
      })
      .on("error", reject);
  });
}

function normalizeKey(name) {
  return name
    .toLowerCase()
    .replaceAll("'", "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const CLASS_MAP = {
  Barbarian: "barbarian",
  Druid: "druid",
  Sorcerer: "sorcerer",
  Rogue: "rogue",
  Necromancer: "necromancer",
  Spiritborn: "spiritborn",
};

async function main() {
  console.log("🔥 Fetching class-skills page-data…", PAGE_DATA_URL);

  const pageData = await fetchJson(PAGE_DATA_URL);

  // Senin paylaştığın yapıda:
  // result.pageContext.skills  → array
  const skills =
    pageData?.result?.pageContext?.skills && Array.isArray(pageData.result.pageContext.skills)
      ? pageData.result.pageContext.skills
      : [];

  console.log("Found skills length:", skills.length);
  if (!skills.length) {
    console.warn("⚠️ No skills found. Check pageData structure.");
  }

  // Ham datayı da saklayalım
  const rawOutPath = path.join(
    process.cwd(),
    "public",
    "data",
    "d4-skills-raw-page-data.json"
  );
  fs.mkdirSync(path.dirname(rawOutPath), { recursive: true });
  fs.writeFileSync(rawOutPath, JSON.stringify(pageData, null, 2), "utf8");
  console.log("💾 Saved raw page-data to:", rawOutPath);

  // Normalize: d4_skills tablosuna uygun hale getiriyoruz
  const mapped = skills.map((s) => {
    const key = normalizeKey(s.name);
    const class_key = CLASS_MAP[s.class] || s.class?.toLowerCase() || "unknown";

    // description array’ini tek stringe birleştiriyoruz
    const description_en = Array.isArray(s.description)
      ? s.description.join("\n\n")
      : null;

    // tags doğrudan geliyor: ["Basic","Bludgeoning", ...]
    const tags = Array.isArray(s.tags) ? s.tags : [];

    const extra_en = Array.isArray(s.extra) ? s.extra : [];

    return {
      key,
      name_en: s.name,
      class_key,
      tags,
      fury_generate: s.fury_generate ?? null,
      lucky_hit: s.lucky_hit ?? null,
      description_en,
      extra_en,
      raw_json: s,
      icon_key: key, // /images/builds/{class_key}/{key}.png ile eşleriz
    };
  });

  const normOutPath = path.join(
    process.cwd(),
    "public",
    "data",
    "d4builds-class-skills.json"
  );
  fs.writeFileSync(normOutPath, JSON.stringify(mapped, null, 2), "utf8");
  console.log("✅ Normalized skills saved to:", normOutPath);
  console.log("Total normalized skills:", mapped.length);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});

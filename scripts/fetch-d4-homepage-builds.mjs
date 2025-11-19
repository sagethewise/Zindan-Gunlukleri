// scripts/fetch-d4-homepage.mjs
import fs from "node:fs/promises";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const URL_DATA = "https://d4builds.gg/page-data/index/page-data.json";

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  console.log("📥 Fetching:", URL_DATA);

  const res = await fetch(URL_DATA);
  const json = await res.json();

  const builds = json?.result?.pageContext?.builds;

  if (!Array.isArray(builds)) {
    console.error("❌ homepage.builds bulunamadı.");
    process.exit(1);
  }

  const mapped = builds.map((b) => ({
    slug: slugify(b.name),
    name_en: b.name,
    name_tr: null,

    tier: b.tier,
    season: b.season,
    pit: b.pit,
    content: b.content,

    class_en: b.class,
    class_key: slugify(b.class),

    creator: b.cc,
    build_uuid: b.buildid,

    skills: b.skills,
    data: b,
  }));

  const saveDir = path.join(__dirname, "..", "public", "data");
  await fs.mkdir(saveDir, { recursive: true });

  const saveFile = path.join(saveDir, "d4-homepage-builds.json");

  await fs.writeFile(saveFile, JSON.stringify(mapped, null, 2), "utf8");

  console.log("💾 Saved:", saveFile);
}

main().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});

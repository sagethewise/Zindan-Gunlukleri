// scripts/fetch-d4-build.mjs
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ESM __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildId = process.argv[2];

if (!buildId) {
  console.error("❌ Kullanım: node scripts/fetch-d4-build.mjs <buildId>");
  process.exit(1);
}

const PAGE_DATA_URL = `https://d4builds.gg/page-data/builds/${buildId}/page-data.json`;

async function main() {
  console.log("📥 Fetching page-data:", PAGE_DATA_URL);

  const res = await fetch(PAGE_DATA_URL);
  if (!res.ok) {
    console.error("❌ HTTP error", res.status, res.statusText);
    process.exit(1);
  }

  const json = await res.json();

  const build = json?.result?.pageContext?.build;
  if (!build) {
    console.error("❌ result.pageContext.build bulunamadı. JSON yapısına bakmak lazım.");
    console.error(JSON.stringify(Object.keys(json?.result?.pageContext || {}), null, 2));
    process.exit(1);
  }

  const publicDir = path.join(__dirname, "..", "public", "data");
  await fs.mkdir(publicDir, { recursive: true });

  const rawPath = path.join(
    publicDir,
    `d4-build-${buildId}-raw-page-data.json`
  );
  const buildPath = path.join(publicDir, `d4-build-${buildId}.json`);

  await fs.writeFile(rawPath, JSON.stringify(json, null, 2), "utf8");
  await fs.writeFile(buildPath, JSON.stringify(build, null, 2), "utf8");

  console.log("💾 Ham page-data kaydedildi:", rawPath);
  console.log("💾 Normalize edilmiş build objesi kaydedildi:", buildPath);
}

main().catch((err) => {
  console.error("❌ Hata:", err);
  process.exit(1);
});

// scripts/fetch-d4-index.mjs
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGE_DATA_URL =
  "https://d4builds.gg/page-data/index/page-data.json";

// JSON içindeki "array of objects" candidate path’lerini bulmak için helper
function findArrayCandidates(obj, pathSegs = []) {
  const results = [];

  if (Array.isArray(obj)) {
    if (obj.length && typeof obj[0] === "object") {
      results.push({
        path: pathSegs,
        length: obj.length,
        sample: obj[0],
      });
    }
    return results;
  }

  if (obj && typeof obj === "object") {
    for (const [key, value] of Object.entries(obj)) {
      results.push(...findArrayCandidates(value, [...pathSegs, key]));
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

  // Candidate array path’leri bul
  const candidates = findArrayCandidates(json);
  console.log("🔍 Bulunan candidate array path'leri:");
  candidates.forEach((c, idx) => {
    console.log(
      `  [${idx}] ${c.path.join(".")} — length: ${c.length}`
    );
  });

  // public/data altına kaydet
  const publicDir = path.join(__dirname, "..", "public", "data");
  await fs.mkdir(publicDir, { recursive: true });

  const rawPath = path.join(publicDir, "d4-index-raw-page-data.json");
  const candidatesPath = path.join(publicDir, "d4-index-candidates.json");

  await fs.writeFile(rawPath, JSON.stringify(json, null, 2), "utf8");
  await fs.writeFile(
    candidatesPath,
    JSON.stringify(
      candidates.map((c) => ({
        path: c.path,
        length: c.length,
        sample: c.sample,
      })),
      null,
      2
    ),
    "utf8"
  );

  console.log("💾 Ham index page-data kaydedildi:", rawPath);
  console.log(
    "💾 Candidate array özetleri kaydedildi:",
    candidatesPath
  );
}

main().catch((err) => {
  console.error("❌ Hata:", err);
  process.exit(1);
});

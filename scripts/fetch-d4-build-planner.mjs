// scripts/fetch-d4-build-planner.mjs
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ❗ Node 18+ global fetch kullanıyoruz
// node-fetch YOK, import etmiyoruz

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGE_DATA_URL =
  "https://d4builds.gg/page-data/build-planner/page-data.json";

// JSON içinde array olan tüm path'leri bul
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

  // ❗ Node 18+ fetch
  const res = await fetch(PAGE_DATA_URL);

  if (!res.ok) {
    console.error("❌ HTTP error", res.status, res.statusText);
    process.exit(1);
  }

  const json = await res.json();

  // 📁 public/data klasörünü oluştur
  const publicDir = path.join(__dirname, "..", "public", "data");
  await fs.mkdir(publicDir, { recursive: true });

  // 1) ham JSON kaydedilsin
  const rawPath = path.join(publicDir, "d4-build-planner-raw-page-data.json");
  await fs.writeFile(rawPath, JSON.stringify(json, null, 2));
  console.log("💾 Ham build planner kaydedildi:", rawPath);

  // 2) candidate array'ler taransın
  const candidates = findArrayCandidates(json);
  const candidatesPath = path.join(
    publicDir,
    "d4-build-planner-candidates.json"
  );

  await fs.writeFile(
    candidatesPath,
    JSON.stringify(
      candidates.map((c) => ({
        path: c.path.join("."),
        length: c.length,
        sample: c.sample,
      })),
      null,
      2
    )
  );

  console.log("\n🔍 Bulunan candidate array path'leri:");
  candidates.forEach((c, idx) => {
    console.log(
      `  [${idx}] ${c.path.join(".")} — length: ${c.length}`
    );
  });

  console.log("\n💾 Candidate özet kaydedildi:", candidatesPath);
}

main().catch((err) => {
  console.error("❌ Hata:", err);
  process.exit(1);
});

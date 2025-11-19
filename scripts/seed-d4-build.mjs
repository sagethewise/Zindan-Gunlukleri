// scripts/seed-d4-build.mjs
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";


// ESM __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ENV yükle (.env.local)
dotenv.config({ path: ".env.local" });

// CLI arg: buildId
const buildId = process.argv[2];

if (!buildId) {
  console.error("❌ Kullanım: node scripts/seed-d4-build.mjs <buildId>");
  process.exit(1);
}

// ENV (senin .env.local formatına uygun)
const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE;

console.log("Loaded ENV:", {
  SUPABASE_URL: supabaseUrl,
  SERVICE_ROLE: supabaseKey ? supabaseKey.slice(0, 12) + "..." : null,
});

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY / SERVICE_ROLE"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// basit slugify
function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const filePath = path.join(
    __dirname,
    "..",
    "public",
    "data",
    `d4-build-${buildId}.json`
  );

  console.log("📖 Reading:", filePath);

  const raw = await fs.readFile(filePath, "utf8");
  const build = JSON.parse(raw);

  // d4builds tarafında alan isimleri:
  // name, tier, season, cc (author), class, content, pit, tags vs.
  const name = build.name || build.title || `Build ${buildId}`;
  const classKey = (build.class || build.class_key || "").toLowerCase() || null;

  const payload = {
    buildid: build.buildid || build.id || buildId,
    slug: slugify(name),
    name_en: name,
    name_tr: null, // 🔜 TR çeviriyi buraya dolduracağız
    class_key: classKey,
    season: build.season ?? null,
    tier: build.tier ?? null,
    content: build.content || null,
    pit: build.pit ?? null,
    author: build.cc || build.author || null,
    tags: Array.isArray(build.tags) ? build.tags : null,
    data: build, // full JSON burada
  };

  console.log("🧩 Upsert payload:", {
    ...payload,
    data: "[jsonb omitted]",
  });

  const { error } = await supabase
    .from("d4_build_details")
    .upsert(payload, { onConflict: "buildid" });

  if (error) {
    console.error("❌ Error upserting d4_build_details:", error);
    process.exit(1);
  }

  console.log("✅ d4_build_details upsert tamam:", payload.buildid);
}

main().catch((err) => {
  console.error("❌ Hata:", err);
  process.exit(1);
});

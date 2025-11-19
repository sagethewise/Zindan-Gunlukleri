// scripts/seed-d4-creator-builds.mjs
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config"; // dotenvx ile uyumlu

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CLI arg: creator slug
const creatorSlug = process.argv[2] || "rob2628";

// ENV: .env.local içindeki değerler
const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE;

console.log("Loaded ENV:", {
  SUPABASE_URL: supabaseUrl,
  SERVICE_ROLE: supabaseKey ? supabaseKey.slice(0, 12) + "..." : null,
});

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing SUPABASE_URL or SERVICE_ROLE / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const filePath = path.join(
    __dirname,
    "..",
    "public",
    "data",
    `d4-creator-${creatorSlug}-builds.json`
  );

  console.log("📖 Reading:", filePath);

  const raw = await fs.readFile(filePath, "utf8");
  const items = JSON.parse(raw);

  console.log("🧮 JSON içindeki toplam kayıt:", items.length);

  // build_id + creator_slug benzersiz, tablo da öyle tanımlandı
  const { error } = await supabase
    .from("d4_creator_builds")
    .upsert(items, {
      onConflict: "build_id,creator_slug",
    });

  if (error) {
    console.error("❌ Error upserting d4_creator_builds:", error);
    process.exit(1);
  }

  console.log("✅ d4_creator_builds upsert tamam.");
}

main().catch((err) => {
  console.error("❌ Hata:", err);
  process.exit(1);
});

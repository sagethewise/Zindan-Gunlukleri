// scripts/seed-d4-runes.mjs
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
    "❌ Missing SUPABASE_URL or SERVICE_ROLE / SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const filePath = path.join(
    __dirname,
    "..",
    "public",
    "data",
    "d4-runes.json"
  );

  console.log("📖 Reading:", filePath);

  const raw = await fs.readFile(filePath, "utf8");
  const items = JSON.parse(raw);

  console.log("🧮 JSON içindeki toplam kayıt:", items.length);

  // slug bazlı tekilleştirme (olası duplicate slug’ları engelle)
  const bySlug = new Map();
  for (const item of items) {
    if (!item.slug) continue;
    if (!bySlug.has(item.slug)) {
      bySlug.set(item.slug, item);
    }
  }
  const deduped = Array.from(bySlug.values());
  console.log(
    "🧹 Tekilleştirilmiş kayıt sayısı (slug bazlı):",
    deduped.length
  );

  const { error } = await supabase
    .from("d4_runes")
    .upsert(deduped, { onConflict: "slug" });

  if (error) {
    console.error("❌ Error upserting d4_runes:", error);
    process.exit(1);
  }

  console.log("✅ d4_runes upsert tamam.");
}

main().catch((err) => {
  console.error("❌ Hata:", err);
  process.exit(1);
});

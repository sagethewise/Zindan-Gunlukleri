// scripts/seed-d4-tempering-manuals.mjs
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// __dirname fix (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env.local içinden env'leri yükle
dotenv.config({ path: ".env.local" });

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE;

console.log("Loaded ENV:", {
  SUPABASE_URL: supabaseUrl,
  SERVICE_ROLE: supabaseKey ? supabaseKey.slice(0, 12) + "..." : null,
});

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "❌ Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_URL veya SUPABASE_SERVICE_ROLE_KEY / SERVICE_ROLE"
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
    "d4-tempering-manuals.json"
  );

  console.log("📖 Reading:", filePath);

  const raw = await fs.readFile(filePath, "utf8");
  const items = JSON.parse(raw);

  console.log("🧮 JSON içindeki toplam kayıt:", items.length);

  // slug bazlı dedupe — aynı slug ikinci kez gelirse sonuncu kazansın
  const slugMap = new Map();
  for (const item of items) {
    if (!item.slug) continue;
    slugMap.set(item.slug, item);
  }

  const deduped = Array.from(slugMap.values());
  console.log("🧮 Dedupe sonrası upsert edilecek kayıt:", deduped.length);

  const { error } = await supabase
    .from("d4_tempering_manuals")
    .upsert(deduped, {
      onConflict: "slug",
    });

  if (error) {
    console.error("❌ Error upserting d4_tempering_manuals:", error);
    process.exit(1);
  }

  console.log("✅ d4_tempering_manuals upsert tamam.");
}

main().catch((err) => {
  console.error("❌ Hata:", err);
  process.exit(1);
});

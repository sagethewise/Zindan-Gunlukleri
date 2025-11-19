// scripts/seed-d4-uniques.mjs
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// ESM __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env.local dosyasını yükle
dotenv.config({ path: ".env.local" });

// ENV değişkenlerini .env.local içindeki isimlere göre çek
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
    "❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (ya da fallback SUPABASE_URL/SERVICE_ROLE)"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Aynı slug'a sahip kayıtları tekilleştir
function dedupeBySlug(items) {
  const map = new Map();

  for (const item of items) {
    // slug yoksa at
    if (!item.slug) continue;

    // aynı slug birden fazlaysa, son geleni yazıyoruz (istersen ilkini tutacak şekilde de ayarlanabilir)
    map.set(item.slug, item);
  }

  return Array.from(map.values());
}

async function main() {
  const filePath = path.join(
    __dirname,
    "..",
    "public",
    "data",
    "d4-uniques.json"
  );

  console.log("📖 Reading:", filePath);

  const raw = await fs.readFile(filePath, "utf8");
  const items = JSON.parse(raw);

  console.log("🧮 JSON içindeki toplam kayıt:", items.length);

  const deduped = dedupeBySlug(items);
  console.log("🧮 Tekilleştirilmiş kayıt sayısı (slug bazlı):", deduped.length);

  const { error } = await supabase
    .from("d4_uniques")
    .upsert(deduped, { onConflict: "slug" });

  if (error) {
    console.error("❌ Error upserting d4_uniques:", error);
    process.exit(1);
  }

  console.log("✅ d4_uniques upsert tamam.");
}

main().catch((err) => {
  console.error("❌ Hata:", err);
  process.exit(1);
});

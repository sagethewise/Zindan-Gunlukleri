// scripts/seed-d4-legendary-aspects.mjs
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
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE;

console.log("Loaded ENV:", {
  SUPABASE_URL: supabaseUrl,
  SERVICE_ROLE: supabaseKey ? supabaseKey.slice(0, 12) + "..." : null,
});

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY / SERVICE_ROLE"
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
    "d4-legendary-aspects.json"
  );

  console.log("📖 Reading:", filePath);

  const raw = await fs.readFile(filePath, "utf8");
  const items = JSON.parse(raw);

  console.log("🧮 JSON içindeki toplam kayıt:", items.length);

  // İleride istersen burada dedupe veya filtre ekleyebiliriz.
  const { data, error } = await supabase
    .from("d4_legendary_aspects")
    .upsert(items, { onConflict: "slug" })
    .select();

  if (error) {
    console.error("❌ Error upserting d4_legendary_aspects:", error);
    process.exit(1);
  }

  console.log(
    `✅ d4_legendary_aspects upsert tamam. Etkilenen kayıt sayısı: ${
      data?.length ?? 0
    }`
  );
}

main().catch((err) => {
  console.error("❌ Hata:", err);
  process.exit(1);
});

// scripts/seed-d4-map.mjs
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { config as dotenvConfig } from "dotenv";

// ESM __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ENV yükle (.env.local)
dotenvConfig({ path: ".env.local" });

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE;

console.log("Loaded ENV:", {
  SUPABASE_URL: supabaseUrl,
  SERVICE_ROLE: supabaseKey ? supabaseKey.slice(0, 12) + "..." : null,
});

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function dedupeBySlug(items) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    if (!item.slug) continue;
    if (seen.has(item.slug)) continue;
    seen.add(item.slug);
    result.push(item);
  }
  return result;
}

async function main() {
  const filePath = path.join(
    __dirname,
    "..",
    "public",
    "data",
    "d4-map-nodes.json"
  );

  console.log("📖 Reading:", filePath);

  const raw = await fs.readFile(filePath, "utf8");
  const items = JSON.parse(raw);

  console.log("🧮 JSON içindeki toplam kayıt:", items.length);

  const deduped = dedupeBySlug(items);
  console.log("🧮 Duplicate slug temizlendikten sonra:", deduped.length);

  // Supabase tablosu varsayımı:
  // d4_map_nodes(
  //   id (uuid, default),
  //   slug text unique,
  //   name_en text,
  //   name_tr text,
  //   zone_en text,
  //   zone_tr text,
  //   description_en text,
  //   description_tr text,
  //   category text,
  //   x numeric,
  //   y numeric,
  //   tags text[],
  //   data jsonb
  // )

  const { error } = await supabase
    .from("d4_map_nodes")
    .upsert(deduped, {
      onConflict: "slug",
    });

  if (error) {
    console.error("❌ Error upserting d4_map_nodes:", error);
    process.exit(1);
  }

  console.log("✅ d4_map_nodes upsert tamam.");
}

main().catch((err) => {
  console.error("❌ Hata:", err);
  process.exit(1);
});

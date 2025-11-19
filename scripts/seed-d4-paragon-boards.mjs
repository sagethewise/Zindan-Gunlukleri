// scripts/seed-d4-paragon-boards.mjs
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// ESM __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ENV yükle (.env.local)
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
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

// basit slugify helper
function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const filePath = path.join(
    __dirname,
    "..",
    "public",
    "data",
    "d4-paragon-boards.json"
  );
  console.log("📖 Reading:", filePath);

  const raw = await fs.readFile(filePath, "utf8");
  const items = JSON.parse(raw);

  console.log("🧮 JSON içindeki raw item sayısı:", items.length);

  // 🔹 Her item için benzersiz slug üret
  const normalized = items.map((item) => {
    const classKey = item.class_key || item.class_en?.toLowerCase();
    const title =
      item.data?.title ||
      item.data?.name ||
      item.name_en ||
      "unknown-node";

    const newSlug = slugify(`${classKey || "all"}-${title}-paragon`);

    return {
      // Supabase tablosundaki kolon isimlerine göre uyarlıyoruz:
      slug: newSlug,
      name_en: item.name_en || title,
      name_tr: item.name_tr ?? null,
      class_en: item.class_en || item.data?.class || null,
      class_key: classKey,
      rarity: item.rarity || null,
      description_en:
        item.description_en || item.data?.description || null,
      description_tr: item.description_tr ?? null,
      tags: item.tags ?? null,
      data: item.data || null,
    };
  });

  console.log("🔎 Örnek normalize kayıtlar (ilk 3):");
  normalized.slice(0, 3).forEach((n) => {
    console.log(`  - ${n.slug} (${n.class_key}) -> ${n.name_en}`);
  });

  console.log("🚀 Upsert edilecek board sayısı:", normalized.length);

  const { error } = await supabase
    .from("d4_paragon_boards")
    .upsert(normalized, {
      onConflict: "slug",
    });

  if (error) {
    console.error("❌ Error upserting d4_paragon_boards:", error);
    process.exit(1);
  }

  console.log("✅ d4_paragon_boards upsert tamam.");
}

main().catch((err) => {
  console.error("❌ Hata:", err);
  process.exit(1);
});

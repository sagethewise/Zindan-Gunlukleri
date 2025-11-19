// scripts/seed-d4-unique-variants.mjs
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";


// __dirname fix (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env.local dosyasını yükle
dotenv.config({ path: ".env.local" });

// Basit slugify – d4_uniques ile aynı mantık olmalı
function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // accent temizle
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ENV
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
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
  const rawPath = path.join(
    __dirname,
    "..",
    "public",
    "data",
    "d4-uniques-raw-page-data.json"
  );

  console.log("📖 Reading raw page-data:", rawPath);

  const rawStr = await fs.readFile(rawPath, "utf8");
  const pageData = JSON.parse(rawStr);

  // d4builds page-data yapısı: result.pageContext.uniques
  const uniques =
    pageData?.result?.pageContext?.uniques && Array.isArray(pageData.result.pageContext.uniques)
      ? pageData.result.pageContext.uniques
      : [];

  if (!uniques.length) {
    console.error("❌ uniques array bulunamadı. result.pageContext.uniques boş.");
    process.exit(1);
  }

  console.log("🧮 JSON içindeki toplam unique varyant:", uniques.length);

  const variants = uniques.map((item, index) => {
    const name = item.name || `Unique #${index + 1}`;
    const uniqueSlug = slugify(name);

    const class_en = item.class || null;
    const class_key = class_en ? class_en.toLowerCase() : null;

    const type_en = item.type || null;

    const tags = Array.isArray(item.filters)
      ? item.filters
      : Array.isArray(item.tags)
      ? item.tags
      : null;

    return {
      unique_slug: uniqueSlug,
      variant_index: index,
      name_en: name,
      name_tr: null, // Çevirileri sonra dolduracağız
      class_en,
      class_key,
      type_en,
      world_tier: item.worldTier ?? null, // büyük ihtimalle yok, ama dursun
      tags,
      raw: item,
    };
  });

  console.log("📦 Upsert edilecek kayıt sayısı:", variants.length);

  const { error } = await supabase
    .from("d4_unique_variants")
    .upsert(variants, {
      onConflict: "unique_slug,variant_index",
    });

  if (error) {
    console.error("❌ Error upserting d4_unique_variants:", error);
    process.exit(1);
  }

  console.log("✅ d4_unique_variants upsert tamamlandı.");
}

main().catch((err) => {
  console.error("❌ Hata:", err);
  process.exit(1);
});

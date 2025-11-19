// scripts/seed-d4-homepage-builds.mjs
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ENV yükle (.env.local)
dotenv.config({ path: ".env.local" });
// ENV
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase ENV");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
async function main() {
  const filePath = path.join(
    __dirname,
    "..",
    "public",
    "data",
    "d4-homepage-builds.json"
  );

  console.log("📖 Reading:", filePath);

  const raw = await fs.readFile(filePath, "utf8");
  const items = JSON.parse(raw);

  console.log("🧮 JSON içindeki toplam kayıt:", items.length);

  // 1) slug bazlı tekilleştirme
  const bySlug = new Map();
  const dupes = new Map(); // slug -> kaç kere daha geldi

  for (const item of items) {
    const key = item.slug;
    if (!key) continue;

    if (bySlug.has(key)) {
      dupes.set(key, (dupes.get(key) || 0) + 1);
      // İstersen burada "ilk geleni" tutup sonrakileri ignore ediyoruz.
      continue;
    }

    bySlug.set(key, item);
  }

  const deduped = Array.from(bySlug.values());

  console.log("🧮 Tekilleştirilmiş kayıt sayısı (slug bazlı):", deduped.length);

  if (dupes.size > 0) {
    console.log("⚠️ Aynı slug ile birden fazla kayıt vardı, ignore edilenler:");
    for (const [slug, count] of dupes.entries()) {
      console.log(`  - ${slug} (fazladan ${count} adet)`);
    }
  }

  // 2) Upsert
  const { error } = await supabase
    .from("d4_homepage_builds")
    .upsert(deduped, {
      onConflict: "slug", // tabloda muhtemelen unique(slug) var
    });

  if (error) {
    console.error("❌ Error upserting d4_homepage_builds:", error);
    process.exit(1);
  }

  console.log("✅ d4_homepage_builds upsert tamam.");

  // 3) Kontrol için sayıyı loglayalım
  const { count, error: countError } = await supabase
    .from("d4_homepage_builds")
    .select("*", { count: "exact", head: true });

  if (countError) {
    console.error("⚠️ Count alınırken hata:", countError);
  } else {
    console.log("📊 d4_homepage_builds tablosundaki toplam kayıt:", count);
  }
}

main().catch((err) => {
  console.error("❌ Hata:", err);
  process.exit(1);
});
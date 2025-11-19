// scripts/seed-d4-my-builds.mjs
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv"; // 🔹 DİKKAT: bu sefer named değil, default import

// ESM __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 .env.local dosyasını elle yükle
dotenv.config({ path: ".env.local" });

// ENV oku
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

// (şimdilik slugify kullanmıyoruz ama elinin altında dursun)
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
    "d4-my-builds.json"
  );

  console.log("📖 Reading:", filePath);

  const raw = await fs.readFile(filePath, "utf8");
  const items = JSON.parse(raw);

  console.log("🧮 JSON içindeki toplam kayıt:", items.length);

  // Eğer gerekirse burada items'i map'leyip normalleştirebilirsin.
  // Şimdilik direkt upsert ediyoruz.
  const { data, error } = await supabase
    .from("d4_my_builds")
    .upsert(items, { onConflict: "slug" })
    .select(); // 🔹 Etkilenen satırları görmek için

  if (error) {
    console.error("❌ Error upserting d4_my_builds:", error);
    process.exit(1);
  }

  console.log(
    `✅ d4_my_builds upsert tamam. Etkilenen kayıt sayısı: ${data?.length ?? 0}`
  );
}

main().catch((err) => {
  console.error("❌ Hata:", err);
  process.exit(1);
});

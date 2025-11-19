// scripts/seed-d4-class-skills.mjs
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// 🔧 ESM __dirname fix
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

// basit slugify helper
function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const filePath = path.join(
    __dirname,
    "..",
    "public",
    "data",
    "d4-class-skills.json"
  );

  console.log("📖 Reading:", filePath);

  const raw = await fs.readFile(filePath, "utf8");
  const skills = JSON.parse(raw);

  console.log("🧮 JSON içindeki toplam skill kaydı:", skills.length);

  const mapped = skills.map((s, index) => {
    // d4-index / class-skills dump'larında genelde gerçek veri 'data' objesinde
    const src = s.data ?? s;

    const baseName = src.name || s.name || `Skill #${index + 1}`;

    // orijinal class bilgisi
    const rawClassEn = src.class || s.class || null;
    const classKeyRaw = rawClassEn ? rawClassEn.toLowerCase() : null;

    // slug için sadece görsellik
    const slug = slugify(
      `${baseName}-${classKeyRaw || "unknown"}`
    );

    // DB için garanti değerler (NOT NULL class_key)
    const class_en = rawClassEn || "Generic";
    const class_key = classKeyRaw || "generic";

    // value1, value2, ... gibi alanları tek bir json içine topla
    const valuesJson = {};
    ["value1", "value2", "value3", "value4", "value5"].forEach((key) => {
      if (src[key] != null) valuesJson[key] = src[key];
    });
    const hasValues = Object.keys(valuesJson).length > 0;

    // runes: description array'lerini tek stringe çevir
    const runesRaw = Array.isArray(src.runes) ? src.runes : s.runes;
    const runesEn = Array.isArray(runesRaw)
      ? runesRaw.map((r) => ({
          name: r.name,
          description:
            Array.isArray(r.description) && r.description.length
              ? r.description.join("\n")
              : r.description ?? null,
        }))
      : null;

    return {
      // 🔑 NOT NULL kolonlar
      key: slug,
      class_key,
      class_en,

      slug,
      name_en: baseName,
      name_tr: null,

      class_tr: null,

      tags: Array.isArray(src.tags)
        ? src.tags
        : Array.isArray(s.tags)
        ? s.tags
        : null,
      filters: Array.isArray(src.filters)
        ? src.filters
        : Array.isArray(s.filters)
        ? s.filters
        : null,

      fury_generate:
        typeof src.fury_generate === "number"
          ? src.fury_generate
          : typeof s.fury_generate === "number"
          ? s.fury_generate
          : null,

      lucky_hit: src.lucky_hit ?? s.lucky_hit ?? null,

      description_en: Array.isArray(src.description)
        ? src.description.join("\n")
        : Array.isArray(s.description)
        ? s.description.join("\n")
        : src.description ?? s.description ?? null,
      description_tr: null,

      extra_en: Array.isArray(src.extra)
        ? src.extra
        : Array.isArray(s.extra)
        ? s.extra
        : null,
      extra_tr: null,

      values_json: hasValues ? valuesJson : null,

      runes_en: runesEn,
      runes_tr: null,

      raw: src,
    };
  });

  // slug bazlı tekilleştirme
  const dedupBySlug = new Map();
  for (const row of mapped) {
    dedupBySlug.set(row.slug, row);
  }
  const payload = Array.from(dedupBySlug.values());

  console.log("🧮 Tekilleştirilmiş kayıt sayısı (slug bazlı):", payload.length);

  const { error } = await supabase
    .from("d4_skills")
    .upsert(payload, {
      onConflict: "slug",
    });

  if (error) {
    console.error("❌ Error upserting d4_skills:", error);
    process.exit(1);
  }

  const { count, error: countError } = await supabase
    .from("d4_skills")
    .select("id", { count: "exact", head: true });

  if (countError) {
    console.error("⚠️ d4_skills count alınırken hata:", countError);
  } else {
    console.log("✅ d4_skills toplam satır sayısı (DB):", count);
  }

  console.log("✅ d4_skills upsert tamam.");
}

main().catch((err) => {
  console.error("❌ Hata:", err);
  process.exit(1);
});



// src/lib/types.ts

// ===== Blog Tipleri =====

export interface PostMetadata {
  title: string;
  date: string;
  summary: string;
  category: string;
  tags?: string[];
  coverImage?: string;
  readingTime?: string;
}

export type Post = {
  slug: string;
  content: string;
  metadata: {
    summary: string;
    title: string;
    date: string;
    tags?: string[];
    category?: string;
    coverImage?: string;
    readingTime?: string;
    type?: "oyun" | "gundem";
    featured?: boolean;
  };
};

// 🔹 Sınıf key union’u
export type D4ClassId =
  | "barbarian"
  | "druid"
  | "necromancer"
  | "rogue"
  | "sorcerer"
  | "spiritborn";

// 🔹 Kartlarda / detayda kullanacağımız skill özeti
export interface D4BuildSkillSummary {
  name: string;
}

// 🔹 Ana build tipi
export interface D4Build {
  // Supabase d4_build_details.id (uuid)
  id: string;

  // slug (ör: "druid-pulverize-ravens")
  slug: string;

  // UI’da gösterdiğin başlık (name_tr || name_en)
  title: string;

  // "barbarian", "druid" vs
  classId: D4ClassId;

  // sezon (10 / 11 vs)
  season: number;

  // opsiyonel alanlar
  tier?: number | null;
  pit?: number | null;

  // "Endgame", "Leveling" vb
  content?: string | null;

  // d4builds.gg orijinal id’si
  buildUuid?: string | null;

  // Kart üstündeki küçük skill listesi
  // ❗ null OLMASIN, sadece undefined olsun
  skills?: D4BuildSkillSummary[];

  // Her türlü ekstra JSON (paragon, full raw data vs)
  rawData?: unknown;

  // DB timestamp’leri – istersen kullanırsın
  createdAt?: string | null;
  updatedAt?: string | null;

  // Eski yerlerden gelen ekstra property’ler bozulmasın diye
  // (mesela videoUrl falan kullanıyorsan)
  [key: string]: unknown;
}

// Build tipleri (leveling / endgame / vb.)
export type D4BuildType =
  | "leveling"
  | "endgame"
  | "nm-dungeon"
  | "helltide"
  | "pvp";



// ---- Gear slot tipleri ----

// Bu dosyada *tek* GearSlotKey tanımı olacak.
// buildDetailLayout vs. hiçbir yerden import ETMİYORUZ.
export type GearSlotKey =
  | "helm"
  | "chest_armor"
  | "gloves"
  | "pants"
  | "boots"
  | "bludgeoning_weapon"
  | "dual_wield_weapon_1"
  | "amulet"
  | "ring_1"
  | "ring_2"
  | "slashing_weapon"
  | "dual_wield_weapon_2";

// Slot label’ları (UI’de kullanıyoruz)
export const GEAR_SLOT_LABELS: Record<GearSlotKey, string> = {
  helm: "Helm",
  chest_armor: "Chest Armor",
  gloves: "Gloves",
  pants: "Pants",
  boots: "Boots",
  bludgeoning_weapon: "Bludgeoning Weapon",
  dual_wield_weapon_1: "Dual-Wield Weapon 1",
  amulet: "Amulet",
  ring_1: "Ring 1",
  ring_2: "Ring 2",
  slashing_weapon: "Slashing Weapon",
  dual_wield_weapon_2: "Dual-Wield Weapon 2",
};

// Build detail layout için ortak listeler
export const LEFT_GEAR_SLOTS: GearSlotKey[] = [
  "helm",
  "chest_armor",
  "gloves",
  "pants",
  "boots",
  "bludgeoning_weapon",
  "dual_wield_weapon_1",
];

export const RIGHT_GEAR_SLOTS: GearSlotKey[] = [
  "amulet",
  "ring_1",
  "ring_2",
  "slashing_weapon",
  "dual_wield_weapon_2",
];

// ---- Supabase d4_items tipi ----

export interface D4Item {
  id: string;
  slug: string;
  name_en: string | null;
  name_tr: string | null;
  slot_key: string | null;
  icon_key: string | null;
  class_key: string | null; // İstersen ileride D4ClassId | null yaparız
}

// ---- build_gear_slots + join d4_items tipi ----

export interface D4BuildGearRow {
  id: string;
  build_id: string;
  slot_key: GearSlotKey;
  unique_name: string | null;
  aspect_name: string | null;
  icon_key: string | null;
  item_id?: string | null;
  d4_items?: D4Item | null;
}
// src/lib/types.ts

// ... mevcut Post, D4ClassId, D4Build, D4Item vs. burada

export interface D4SkillRune {
  name_en: string | null;
  name_tr: string | null;
  description_en: string | null;
  description_tr: string | null;
}

export interface D4SkillRow {
  id: string;
  key: string;                  // skill unique key
  slug: string | null;
  name_en: string | null;
  name_tr: string | null;
  class_key: D4ClassId | null;  // barbarian, druid, ...
  tags: string[] | null;
  fury_generate: number | null;
  lucky_hit: string | null;

  description_en: string | null;
  description_tr: string | null;

  // seed scriptte JSONB tuttuğumuz alan:
  runes: D4SkillRune[] | null;

  // orijinal page-data’dan gelen her şey:
  data?: unknown; // istersen ileride daha detaylı type’layabilirsin
}
// Build Fırını ana sayfa kartları için tip
export type HomepageBuild = {
  id: string;
  slug: string;
  title: string;

  type?: D4BuildType;
  season: number;

  content?: string | null;
  tier?: number | null;
  pit?: number | null;
  chaosPerkId?: number | null;

  classId: D4ClassId;
  className: string;

  creator: string | null;
  buildUuid: string | null;

  // kart üstündeki küçük skill listesi
  skills: { name: string }[];

  // raw data (tooltip / future analiz için)
  rawData: unknown;
};

// ===================================================
// SUPABASE RAW ROW TYPES
// ===================================================

export interface D4BuildDetailRow {
  id: string;
  buildid: string;
  slug: string;
  name_en: string | null;
  name_tr: string | null;
  class_key: string | null;
  class_en: string | null;
  season: number | null;
  tier: number | null;
  content: string | null;
  pit: number | null;
  author: string | null;
  tags: string[] | null;
  skills: string | null;       // DB'de JSON string
  data: unknown | null;
  created_at: string | null;
  updated_at: string | null;
  build_uuid: string | null;
}


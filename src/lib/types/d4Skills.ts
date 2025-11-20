export type D4Skill = {
  id: string;
  key: string;          // örn: "booming-voice-barbarian" / "rend-barbarian"
  slug: string | null;
  name_en: string | null;
  name_tr: string | null;
  class_key: string;    // "barbarian", "spiritborn", ...
  class_en: string | null;
  description_en: string | null;
  description_tr: string | null;
  icon_key: string | null;  // varsa ikon dosyasının ana adı: "concussion", "hemorrhage" gibi
  values_json: any | null;  // Supabase jsonb -> TS tarafında unknown
  raw: any | null;          // içinde description array’i olan full json
};

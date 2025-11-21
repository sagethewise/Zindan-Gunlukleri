// src/lib/d4Skills.ts
import { supabase } from "./supabaseClient";
import type { D4Skill } from "@/lib/types/d4Skills";

const SKILL_SELECT = `
  id,
  key,
  name_en,
  name_tr,
  class_key,
  class_en,
  description_en,
  description_tr,
  icon_key,
  values_json,
  raw
`;

// 1) KEY listesine göre skill çek (mevcut fonksiyonu biraz genişletiyoruz)
export async function getSkillsByKeys(keys: string[]): Promise<D4Skill[]> {
  if (!keys || keys.length === 0) return [];

  const { data, error } = await supabase
    .from("d4_skills")
    .select(SKILL_SELECT)
    .in("key", keys);

  if (error) {
    console.error("[getSkillsByKeys] Supabase error:", error);
    return [];
  }

  return (data ?? []) as D4Skill[];
}

// 2) İSİM listesine göre skill çek (asıl build spesifik mantık burası)
export async function getSkillsByNames(classId: string, p0: number, names: string[]): Promise<D4Skill[]> {
  if (!names || names.length === 0) return [];

  const { data, error } = await supabase
    .from("d4_skills")
    .select(SKILL_SELECT)
    .in("name_en", names); // d4_build_details / homepage skills name_en ile eşleşiyor varsayımı

  if (error) {
    console.error("[getSkillsByNames] Supabase error:", error);
    return [];
  }

  return (data ?? []) as D4Skill[];
}

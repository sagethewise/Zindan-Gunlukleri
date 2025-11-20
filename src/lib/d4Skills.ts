import { createClient } from "@supabase/supabase-js";
import type { D4Skill } from "@/lib/types/d4Skills";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getSkillsByKeys(keys: string[]): Promise<D4Skill[]> {
  if (!keys.length) return [];

  const { data, error } = await supabase
    .from("d4_skills")
    .select(
      `
      id,
      key,
      slug,
      name_en,
      name_tr,
      class_key,
      class_en,
      description_en,
      description_tr,
      icon_key,
      values_json,
      raw
    `
    )
    .in("key", keys);

  if (error) {
    console.error("[getSkillsByKeys] Supabase error:", error);
    return [];
  }

  // Güvenli cast
  return (data ?? []) as D4Skill[];
}

"use server";

import { createClient } from "@/lib/supabase-server";
import { CURRENT_D4_SEASON } from "@/lib/constants";

/**
 * Homepage build listesini getirir (build-firini için)
 */
export async function getHomepageBuilds(
  season: number = CURRENT_D4_SEASON
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("d4_homepage_builds")
    .select("*")
    .eq("season", season)
    .order("id", { ascending: true });

  if (error) {
    console.error("🔥 Supabase homepage error:", error);
    return [];
  }

  if (!data) return [];

  // 🔥 UI'ın ihtiyaç duyduğu alanları normalize ediyoruz
  const mapped = data.map((row) => ({
    ...row,

    // UI bunu istiyor → class_key üzerinden üretiyoruz
    classId: row.class_key?.toLowerCase(),

    // UI BuildCard "title" bekliyor
    title: row.name_en ?? row.name_tr ?? row.slug,

    // skills bazen text olabilir → normalize et
    skills: Array.isArray(row.skills) ? row.skills : [],

    // content → type (UI bazen 'endgame' bekliyor)
    type: row.content?.toLowerCase() ?? "endgame",

    // bunlar detay sayfada lazım, aynı bırak
    buildUuid: row.build_uuid,
    creator: row.creator,
    pit: row.pit,
    tier: row.tier,
  }));

  return mapped;
}

/**
 * Tek build (slug ile)
 */
export async function getHomepageBuildBySlug(slug: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("d4_homepage_builds")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  return {
    ...data,

    classId: data.class_key?.toLowerCase(),
    title: data.name_en ?? data.name_tr ?? data.slug,
    skills: Array.isArray(data.skills) ? data.skills : [],
    type: data.content?.toLowerCase() ?? "endgame",
    buildUuid: data.build_uuid,
    creator: data.creator,
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { supabaseBuilds } from "@/lib/supabase-builds";
import { CURRENT_D4_SEASON } from "@/lib/constants";
import type { D4Build, D4BuildType, D4ClassId } from "@/lib/types";

/**
 * d4_homepage_builds satırını D4Build şekline çevirir
 */
function mapHomepageRowToD4Build(row: any): D4Build & {
  skills?: { name: string }[];
  buildUuid?: string | null;
  creator?: string | null;
  pit?: number | null;
  tier?: number | null;
  data?: unknown;
} {
  const type: D4BuildType =
    (row.content?.toLowerCase() as D4BuildType) ?? "endgame";

  const classId = (row.class_key?.toLowerCase() ??
    "druid") as D4ClassId; // fallback önemli

  // data JSONB sütununu parse edelim (string gelebilir)
  let parsedData: any = null;
  if (row.data) {
    try {
      parsedData =
        typeof row.data === "string" ? JSON.parse(row.data) : row.data;
    } catch {
      parsedData = row.data;
    }
  }

  // skills JSONB sütunu da string olabiliyor → normalize
  let skills: { name: string }[] = [];
  if (row.skills) {
    try {
      const raw =
        typeof row.skills === "string"
          ? JSON.parse(row.skills)
          : row.skills;
      if (Array.isArray(raw)) {
        skills = raw;
      }
    } catch {
      // parse edilemezse boş bırak
      skills = [];
    }
  }

  return {
    id: row.id,
    slug: row.slug,
    title: row.name_en ?? row.name_tr ?? row.slug,
    classId,
    type,
    season: row.season ?? CURRENT_D4_SEASON,
    pitLevel: row.pit ?? null,
    tags: parsedData?.tags ?? null,

    // extra alanlar (BuildDetail için)
    skills,
    buildUuid: row.build_uuid ?? null,
    creator: row.creator ?? null,
    pit: row.pit ?? null,
    tier: row.tier ?? null,
    data: parsedData,
  };
}

/**
 * Homepage build listesini getirir (build-firini için)
 */
export async function getHomepageBuilds(
  season: number = CURRENT_D4_SEASON
) {
  const { data, error } = await supabaseBuilds
    .from("d4_homepage_builds")
    .select("*")
    .eq("season", season)
    .order("id", { ascending: true });

  if (error) {
    console.error("🔥 Supabase homepage error:", error);
    return [];
  }

  if (!data) return [];

  return data.map(mapHomepageRowToD4Build);
}

/**
 * Tek homepage build (slug ile)
 * – sadece homepage listesine özel kullanmak istersen
 */
export async function getHomepageBuildBySlug(slug: string) {
  const { data, error } = await supabaseBuilds
    .from("d4_homepage_builds")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  return mapHomepageRowToD4Build(data);
}

/**
 * Detail sayfa için tek build (slug ile)
 * BuildDetailPage bu fonksiyonu kullanıyor.
 */
export async function getBuildBySlug(slug: string) {
  // Şu an için detail sayfada kullanacağımız ana kaynak yine d4_homepage_builds
  const base = await getHomepageBuildBySlug(slug);
  if (!base) return null;

  // İleride d4_build_details, paragon vs ekleyeceksen
  // burada ekstra Supabase çağrılarıyla merge edebilirsin.
  // Şimdilik sadece base’i dönüyoruz.
  return base;
}

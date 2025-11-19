"use server";

import { createClient } from "@/lib/supabase-server";
import { CURRENT_D4_SEASON } from "@/lib/constants";

/**
 * Homepage Build'leri getirir (build-firini sayfası)
 */
export async function getHomepageBuilds(season = CURRENT_D4_SEASON) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("d4_homepage_builds")
    .select("*")
    .eq("season", season)
    .order("tier", { ascending: true });

  if (error) {
    console.error("getHomepageBuilds error:", error);
    return [];
  }

  return data ?? [];
}

/**
 * Slug’a göre tek build getirir
 */
export async function getHomepageBuildBySlug(slug: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("d4_homepage_builds")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("getHomepageBuildBySlug error:", error);
    return null;
  }

  return data;
}

import { NextResponse, NextRequest } from "next/server";
import { supabaseBuilds } from "@/lib/supabase-builds";

type Row = {
  id: string;
  slug: string;
  title: string;
  author: string | null;
  season: number | null;
  mode: "endgame" | "leveling";
  class_key: "barbarian" | "druid" | "necromancer" | "rogue" | "sorcerer" | "spiritborn" | "unknown";
  pit: number | null;
  is_meta: boolean;
  score: number;
  icon_urls: string[] | null;
  updated_at: string;
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const seasonParam = searchParams.get("season");
    const modeParam = (searchParams.get("mode") || "").toLowerCase();
    const classKeyParam = (searchParams.get("class_key") || "").toLowerCase();
    const search = (searchParams.get("search") || "").trim();

    const limit = Math.min(Number(searchParams.get("limit") || 60), 100);
    const page = Math.max(Number(searchParams.get("page") || 1), 1);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabaseBuilds
      // .schema("buildfirini") // ❌ kaldır
      .from("v_builds")        // ✅ view
      .select(
        "id, slug, title, author, season, mode, class_key, pit, is_meta, score, icon_urls, updated_at",
        { count: "exact" }
      );

    const seasonNum = seasonParam ? Number(seasonParam) : undefined;
    if (Number.isFinite(seasonNum as number)) query = query.eq("season", seasonNum as number);
    if (modeParam) query = query.eq("mode", modeParam);
    if (classKeyParam) query = query.eq("class_key", classKeyParam);
    if (search) query = query.ilike("title", `%${search}%`);

    const { data, error, count } = await query
      .order("is_meta", { ascending: false })
      .order("pit", { ascending: false })
      .order("score", { ascending: false })
      .order("title", { ascending: true })
      .range(from, to)
      .returns<Row[]>();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(
      { items: data ?? [], page, limit, total: count ?? 0 },
      { status: 200, headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" } }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

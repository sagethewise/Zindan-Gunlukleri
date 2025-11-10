// app/api/builds/route.ts
import { NextResponse, NextRequest } from "next/server";
import { supabaseBuilds } from "@/lib/supabase-builds";

type Row = {
  id: string;
  slug: string;
  title: string;
  author: string | null;
  season: number | null;
  mode: "endgame" | "leveling";
  class_key:
    | "barbarian"
    | "druid"
    | "necromancer"
    | "rogue"
    | "sorcerer"
    | "spiritborn"
    | "unknown";
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
    const modeParam = (searchParams.get("mode") || "").toLowerCase(); // endgame|leveling
    const classKeyParam = (searchParams.get("class_key") || "").toLowerCase();
    const search = (searchParams.get("search") || "").trim();

    const limit = Math.min(Number(searchParams.get("limit") || 60), 100);
    const page = Math.max(Number(searchParams.get("page") || 1), 1);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // 1) BASE SELECT → Filter builder döner
    let query = supabaseBuilds
      .from("builds")
      .select(
        "id, slug, title, author, season, mode, class_key, pit, is_meta, score, icon_urls, updated_at",
        { count: "exact" }
      );

    // 2) FILTERS (eq/or) — order/range'den önce
    const seasonNum = seasonParam ? Number(seasonParam) : undefined;
    if (Number.isFinite(seasonNum as number)) {
      query = query.eq("season", seasonNum as number);
    }
    if (modeParam) {
      query = query.eq("mode", modeParam);
    }
    if (classKeyParam) {
      query = query.eq("class_key", classKeyParam);
    }
    if (search) {
      // title veya summary içinde arama
      // Not: or() filter builder üstünde çağrılmalı
      query = query.or(
        `title.ilike.%${search}%,summary.ilike.%${search}%`
      );
    }

    // 3) ORDER + RANGE (transform builder’a geçiş artık sorun değil)
    query = query
      .order("is_meta", { ascending: false })
      .order("pit", { ascending: false })
      .order("score", { ascending: false })
      .order("title", { ascending: true })
      .range(from, to);

    // 4) Tip ipucu (opsiyonel): .returns<Row[]>()
    const { data, error, count } = await query.returns<Row[]>();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500, headers: { "Cache-Control": "no-store" } }
      );
    }

    return NextResponse.json(
      {
        items: data ?? [],
        page,
        limit,
        total: count ?? 0,
      },
      {
        status: 200,
        headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
      }
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: msg },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

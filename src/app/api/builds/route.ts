import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const season = searchParams.get("season") || "11";
  const mode = searchParams.get("mode") || "endgame";
  const cls = searchParams.get("class") || undefined;

  const nextCookies = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n) => nextCookies.get(n)?.value, set(){}, remove(){} } }
  );

  let query = supabase.from("d4_builds").select("id, slug, title, author, season, mode, class_key, pit");
  query = query.eq("season", season).eq("mode", mode);
  if (cls) query = query.eq("class_key", cls);

  const { data, error } = await query.order("pit", { ascending: false }).order("title");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // ikonları ayrı tablodan çekmek istersen burada join’leyip diziye ekleyebilirsin
  return NextResponse.json({ data });
}

// app/api/builds/[class]/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export const runtime = "nodejs";

export async function GET(
  _req: Request, { params }: { params: { class: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data, error } = await supabase
    .from("d4_builds")
    .select("*")
    .eq("class", params.class);

  return NextResponse.json({ data, error });
}

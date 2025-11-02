// app/builds/[class]/[slug]/page.tsx
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function generateMetadata({ params }: { params: { class: string; slug: string } }) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("d4_builds")
    .select("title")
    .eq("class", params.class)
    .eq("slug", params.slug)
    .single();
  return { title: data ? `${data.title} | Zindan Günlükleri` : "Build Bulunamadı" };
}

export default async function BuildDetailPage({ params }: { params: { class: string; slug: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: build } = await supabase
    .from("d4_builds")
    .select("id, title, subtitle, guide_md, skills_json, aspects_json, gear_json")
    .eq("class", params.class)
    .eq("slug", params.slug)
    .single();

  if (!build) notFound();

  return (
    <main className="px-4 py-8 max-w-3xl mx-auto prose prose-invert">
      <h1 className="!mb-1">{build.title}</h1>
      {build.subtitle && <p className="text-gray-400 !mt-0">{build.subtitle}</p>}
      {/* Buraya guide_md'yi MD render ile, JSON alanları da ufak kartlarla gösterebilirsin */}
      {/* İleride istersen TierList tarafındaki 'Loader' yaklaşımı gibi client-side görselleştirici ekleriz. */}
    </main>
  );
}

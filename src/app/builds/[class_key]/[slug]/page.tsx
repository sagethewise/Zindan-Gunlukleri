import { supabaseBuilds } from "@/lib/supabase-builds";
import Link from "next/link";

export const revalidate = 60;

// ✅ params artık Promise tipinde
type Params = { class_key: string; slug: string };

export default async function BuildDetail({
  params,
}: {
  params: Promise<Params>;
}) {
  // ✅ Promise'ten değerleri al
  const { class_key, slug } = await params;

  const { data: build, error } = await supabaseBuilds
    .from("v_builds")
    .select(
      "id, title, class_key, summary, updated_at, video_url, season, difficulty, starter_friendly"
    )
    .eq("class_key", class_key)
    .eq("slug", slug)
    .single();

  if (error || !build) {
    return (
      <div className="p-8 text-center text-gray-400">
        <h1 className="text-2xl font-bold mb-2">Build bulunamadı</h1>
        <Link href="/builds" className="text-blue-400 hover:underline">
          ← Build listesine dön
        </Link>
      </div>
    );
  }

  const updatedDate = new Date(build.updated_at).toLocaleDateString("tr-TR");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">
      <header className="text-center space-y-3">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          {build.title}
        </h1>
        <p className="text-sm uppercase tracking-widest text-gray-400">
          {build.class_key}
        </p>
        <p className="text-xs text-gray-500">Güncellendi: {updatedDate}</p>
      </header>

      {build.video_url && (
        <div className="aspect-video rounded-2xl overflow-hidden border border-white/10">
          <iframe
            src={build.video_url.replace("watch?v=", "embed/")}
            className="w-full h-full"
            allowFullScreen
            loading="lazy"
          />
        </div>
      )}

      <section className="bg-white/5 border border-white/10 p-6 rounded-2xl">
        {build.summary ? (
          <p className="text-slate-200">{build.summary}</p>
        ) : (
          <p className="italic text-slate-400">
            Bu build için açıklama henüz eklenmemiş.
          </p>
        )}
      </section>

      <div className="pt-6 text-center">
        <Link href="/builds" className="text-blue-400 hover:underline">
          ← Tüm Buildler
        </Link>
      </div>
    </div>
  );
}

// İstersen tamamen dinamik bırak; generateStaticParams şart değil.
// export const dynamicParams = true;

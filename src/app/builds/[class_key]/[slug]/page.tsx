/* build>[class_key]>[slug]>page.tsx */
import { supabaseBuilds } from "@/lib/supabase-builds";
import Link from "next/link";

export const revalidate = 60; // her 1 dakikada bir revalidate

export default async function BuildDetail({
  params,
}: {
  params: { class_key: string; slug: string };
}) {
  const { data: build, error } = await supabaseBuilds
    .from("builds")
    .select(
      "id, title, class_key, summary, updated_at, video_url, season, difficulty, starter_friendly"
    )
    .eq("class_key", params.class_key)
    .eq("slug", params.slug)
    .single();
    

  // Hata veya boş veri durumları
  if (error || !build) {
    console.error("Supabase error:", error);
    return (
      <div className="p-8 text-center text-gray-500">
        <h1 className="text-2xl font-bold mb-2">Build bulunamadı</h1>
        <p className="mb-4">
          İstediğin yapı mevcut değil veya kaldırılmış olabilir.
        </p>
        <Link
          href="/builds"
          className="text-blue-600 hover:underline font-medium"
        >
          ← Build listesine dön
        </Link>
      </div>
    );
  }

  const updatedDate = new Date(build.updated_at).toLocaleDateString("tr-TR");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">
      {/* Başlık alanı */}
      <header className="text-center space-y-3">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          {build.title}
        </h1>
        <p className="text-sm uppercase tracking-widest text-gray-400">
          {build.class_key}
        </p>
        <div className="flex justify-center gap-2 text-xs text-gray-500">
          {build.season && (
            <span className="px-2 py-0.5 rounded bg-gray-100">
              S{build.season}
            </span>
          )}
          {build.difficulty && (
            <span className="px-2 py-0.5 rounded bg-gray-100">
              {build.difficulty}
            </span>
          )}
          {build.starter_friendly && (
            <span className="px-2 py-0.5 rounded bg-green-100 text-green-800">
              Yeni Oyuncu Dostu
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400">Güncellendi: {updatedDate}</p>
      </header>

      {/* Video (varsa) */}
      {build.video_url && (
        <div className="aspect-video rounded-2xl overflow-hidden border">
          <iframe
            src={build.video_url.replace("watch?v=", "embed/")}
            className="w-full h-full"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      )}

      {/* Açıklama */}
      <section className="prose prose-zinc max-w-none bg-white p-6 rounded-2xl shadow-sm">
        {build.summary ? (
          <p>{build.summary}</p>
        ) : (
          <p className="italic text-gray-500">
            Bu build için açıklama henüz eklenmemiş.
          </p>
        )}
      </section>

      {/* Gezinme */}
      <div className="pt-6 text-center">
        <Link
          href="/builds"
          className="inline-block text-blue-600 hover:underline"
        >
          ← Tüm Buildler
        </Link>
      </div>
    </div>
  );
}

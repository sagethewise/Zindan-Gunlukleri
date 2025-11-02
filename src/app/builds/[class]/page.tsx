// app/builds/[class]/page.tsx
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const VALID = new Set(["barbarian", "sorcerer", "rogue", "druid", "necromancer"]);

export async function generateMetadata({ params }: { params: { class: string } }) {
  const cls = params.class;
  const title = VALID.has(cls) ? `${cls[0].toUpperCase()}${cls.slice(1)} Build’leri | Zindan Günlükleri` : "Build’ler";
  return { title };
}

export default async function ClassBuildsPage({ params }: { params: { class: string } }) {
  const cls = params.class;
  if (!VALID.has(cls)) notFound();

  const supabase = createSupabaseServerClient();
  // Örnek tablo adı: d4_builds  (id, class, slug, title, subtitle, updated_at ...)
  const { data, error } = await supabase
    .from("d4_builds")
    .select("id, slug, title, subtitle, updated_at")
    .eq("class", cls)
    .order("updated_at", { ascending: false });

  if (error) {
    return <main className="px-4 py-8 max-w-6xl mx-auto">Hata: {error.message}</main>;
  }

  return (
    <main className="px-4 py-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{cls[0].toUpperCase() + cls.slice(1)} Build’leri</h1>
      {!data?.length ? (
        <p className="text-gray-600">Bu sınıf için henüz build eklenmemiş.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data!.map((b) => (
            <a key={b.id} href={`/builds/${cls}/${b.slug}`} className="border rounded-xl p-4 hover:shadow">
              <h2 className="text-lg font-semibold">{b.title}</h2>
              {b.subtitle && <p className="text-sm text-gray-600">{b.subtitle}</p>}
              <p className="text-xs text-gray-400 mt-2">Güncelleme: {new Date(b.updated_at).toLocaleDateString()}</p>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}

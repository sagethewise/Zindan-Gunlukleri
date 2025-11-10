import { supabaseBuilds } from "@/lib/supabase-builds";
import Hero from "@/components/Hero";
import Link from "next/link";

type BuildRow = {
  id: string;
  slug: string;
  title: string;
  class_key: "barbarian" | "druid" | "necromancer" | "rogue" | "sorcerer" | "spiritborn" | "unknown";
  summary: string | null;
  updated_at: string;
};

export const revalidate = 60;

export default async function Home() {
  const { data, error } = await supabaseBuilds
    // .schema("buildfirini")  // ❌ kaldır
    .from("v_builds")          // ✅ view'dan oku
    .select("id, slug, title, class_key, summary, updated_at")
    .order("updated_at", { ascending: false })
    .limit(9);

  if (error) {
    console.error("Supabase error:", error);
    return (
      <div className="p-8 text-center text-red-400">
        Veri yüklenemedi. Lütfen daha sonra tekrar deneyin.
      </div>
    );
  }

  const builds = (data ?? []) as BuildRow[];

  return (
    <div className="space-y-10">
      <Hero />
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Son Eklenen Yapılar</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {builds.map((b) => (
            <Link
              key={b.id}
              href={`/builds/${b.class_key}/${b.slug}`}
              className="block rounded-2xl border border-white/10 bg-white/5 p-4 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold">{b.title}</h3>
                <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-white/10">
                  {b.class_key}
                </span>
              </div>
              {b.summary && <p className="text-sm text-slate-300 mt-2">{b.summary}</p>}
              <div className="mt-4 text-xs text-slate-400">
                Güncellendi: {new Date(b.updated_at).toLocaleDateString("tr-TR")}
              </div>
            </Link>
          ))}
          {!builds.length && <p className="text-sm text-slate-400">Henüz veri yok.</p>}
        </div>
      </section>
    </div>
  );
}

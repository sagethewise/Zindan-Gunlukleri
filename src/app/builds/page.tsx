/* build>page.tsx */

import { supabaseBuilds } from "@/lib/supabase-builds";
import Hero from "@/components/Hero";
import Link from "next/link";

type BuildRow = {
  id: string;
  slug: string;
  title: string;
  class_key: "barbarian" | "sorcerer" | "rogue" | "druid" | "necromancer" | "spiritborn" | "unknown";
  summary: string | null;
  updated_at: string;
};

export const revalidate = 60;

export default async function Home() {
  const { data, error } = await supabaseBuilds
    .from("builds")
    .select("id, slug, title, class_key, summary, updated_at")
    .order("updated_at", { ascending: false })
    .limit(9)
    .returns<BuildRow[]>();

  if (error) console.error("Supabase error:", error);

  const builds = data ?? [];

  return (
    <div className="space-y-10">
      <Hero />
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Son Eklenen Yapılar</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {builds.map((b) => (
            <Link
              key={b.id}
              /* 👇 Klasör yapına göre A veya B'yi kullan */
              href={`/builds/${b.class_key}/${b.slug}`}           // A) hedef yapımız (önerilen)
              // href={`/builds/class/${b.class_key}/${b.slug}`}  // B) mevcut yapın buysa bunu kullan
              className="block rounded-2xl border bg-white p-4 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold">{b.title}</h3>
                <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-gray-100">
                  {b.class_key}
                </span>
              </div>
              {b.summary && <p className="text-sm text-gray-600 mt-2">{b.summary}</p>}
              <div className="mt-4 text-xs text-gray-500">
                Güncellendi: {new Date(b.updated_at).toLocaleDateString("tr-TR")}
              </div>
            </Link>
          ))}
          {!builds.length && <p className="text-sm text-gray-500">Henüz veri yok.</p>}
        </div>
      </section>
    </div>
  );
}

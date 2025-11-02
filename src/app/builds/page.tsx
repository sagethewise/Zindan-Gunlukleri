// app/builds/page.tsx
import Link from "next/link";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const classes = [
  { slug: "barbarian", name: "Barbarian" },
  { slug: "sorcerer", name: "Sorcerer" },
  { slug: "rogue", name: "Rogue" },
  { slug: "druid", name: "Druid" },
  { slug: "necromancer", name: "Necromancer" },
];

export default async function BuildsHome() {
  return (
    <main className="px-4 py-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Diablo IV Build’leri</h1>
      <p className="text-gray-600 mb-8">Sınıf seçerek build listelerine geç.</p>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {classes.map((c) => (
          <Link key={c.slug} href={`/builds/${c.slug}`} className="border rounded-xl p-4 hover:shadow">
            <h2 className="text-xl font-semibold">{c.name}</h2>
            <p className="text-sm text-gray-500">Tüm {c.name} build’leri</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

// src/app/d4/builds/page.tsx
import { createClient } from "@/lib/supabase-server";
import BuildListClient, {
  BuildListItem,
} from "../../../components/builds/BuildListClient";

export const revalidate = 60; // 1 dk

export default async function D4BuildsPage() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("d4_builds")
    .select(
      "id, slug, title, class_key, type, season, pit_level, tags"
    )
    .order("season", { ascending: false });

  if (error) {
    console.error("Error fetching d4_builds:", error);
  }

  const builds: BuildListItem[] =
    (data ?? []).map((row: any) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      classId: row.class_key,
      type: row.type,
      season: row.season,
      pitLevel: row.pit_level,
      tags: row.tags,
    })) ?? [];

  return (
    <main className="mx-auto max-w-6xl space-y-5 px-4 py-6">
      <header className="border-b border-slate-200 pb-3">
        <h1 className="text-lg font-semibold text-slate-900">
          Diablo IV Build’ler
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Tüm class’lar için leveling / endgame build listesi.
        </p>
      </header>

      <BuildListClient builds={builds} />
    </main>
  );
}

// src/app/d4/skills/page.tsx
import { createClient } from "@/lib/supabase-server";
import SkillsListClient, {
  SkillListItem,
} from "../../../components/d4/SkillsListClient";

export const revalidate = 300;

export default async function D4SkillsPage() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("d4_skills")
    .select(
      "key, name_en, name_tr, class_key, tags, lucky_hit, fury_generate"
    )
    .order("class_key", { ascending: true })
    .order("key", { ascending: true });

  if (error) {
    console.error("Error fetching d4_skills:", error);
  }

  const skills: SkillListItem[] =
    (data ?? []).map((row: any) => ({
      key: row.key,
      name_en: row.name_en,
      name_tr: row.name_tr,
      class_key: row.class_key,
      tags: row.tags,
      lucky_hit: row.lucky_hit,
      fury_generate: row.fury_generate,
    })) ?? [];

  return (
    <main className="mx-auto max-w-6xl space-y-5 px-4 py-6">
      <header className="border-b border-slate-200 pb-3">
        <h1 className="text-lg font-semibold text-slate-900">
          Diablo IV Skill Veritabanı
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Tüm class’lar için skill listesi · TR/EN isim desteği.
        </p>
      </header>

      <SkillsListClient skills={skills} />
    </main>
  );
}

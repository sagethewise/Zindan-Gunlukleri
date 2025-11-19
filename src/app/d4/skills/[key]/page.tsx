// src/app/d4/skills/[key]/page.tsx
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

interface SkillRuneJson {
  name?: string | null;
  description?: string[] | null;
}

type SkillRow = {
  key: string;
  name_en: string | null;
  name_tr: string | null;
  class_key: string | null;
  tags: string[] | null;
  lucky_hit: string | null;
  fury_generate: number | null;
  description_en: string | null;
  description_tr: string | null;
  extra_en: string[] | null;
  filters: string[] | null;
  runes_json: SkillRuneJson[] | null;
};

interface PageProps {
  params: { key: string };
}

export default async function SkillDetailPage({ params }: PageProps) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("d4_skills")
    .select(
      "key, name_en, name_tr, class_key, tags, lucky_hit, fury_generate, description_en, description_tr, extra_en, filters, runes_json"
    )
    .eq("key", params.key)
    .maybeSingle();

  if (error) {
    console.error("Error fetching d4_skills row:", error);
  }

  if (!data) {
    notFound();
  }

  const row = data as SkillRow;

  // 🔑 İstediğin fallback yapısı:
  const name =
    row.name_tr ?? row.name_en ?? row.key;
  const desc =
    row.description_tr ?? row.description_en;

  const tags: string[] = row.tags ?? [];
  const filters: string[] = row.filters ?? [];
  const runes: SkillRuneJson[] = row.runes_json ?? [];

  return (
    <main className="mx-auto max-w-4xl space-y-5 px-4 py-6">
      <header className="border-b border-slate-200 pb-3">
        <h1 className="text-lg font-semibold text-slate-900">{name}</h1>
        <p className="mt-1 text-xs text-slate-500">
          {row.class_key ? `${row.class_key} · ` : ""}Key: <code>{row.key}</code>
        </p>
      </header>

      {/* Üst özet */}
      <section className="grid gap-3 rounded-xl border border-slate-200 bg-white/80 p-4 text-xs md:grid-cols-3">
        <div>
          <div className="text-[11px] font-semibold text-slate-700">
            Resource
          </div>
          <div className="mt-1 text-[11px] text-slate-600">
            {row.fury_generate != null
              ? `Fury Generate: ${row.fury_generate}`
              : "—"}
          </div>
          <div className="mt-1 text-[11px] text-slate-600">
            {row.lucky_hit ? `Lucky Hit: ${row.lucky_hit}` : "Lucky Hit: —"}
          </div>
        </div>

        <div>
          <div className="text-[11px] font-semibold text-slate-700">
            Tags
          </div>
          <div className="mt-1 flex flex-wrap gap-1">
            {tags.length === 0 && (
              <span className="text-[11px] text-slate-400">
                Tag bilgisi yok.
              </span>
            )}
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[11px] font-semibold text-slate-700">
            Filters
          </div>
          <div className="mt-1 flex flex-wrap gap-1">
            {filters.length === 0 && (
              <span className="text-[11px] text-slate-400">
                Filter bilgisi yok.
              </span>
            )}
            {filters.map((f: string) => (
              <span
                key={f}
                className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] text-purple-700"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Açıklama */}
      <section className="rounded-xl border border-slate-200 bg-white/80 p-4 text-xs">
        <h2 className="mb-2 text-[11px] font-semibold text-slate-700">
          Açıklama
        </h2>
        {desc ? (
          <p className="whitespace-pre-line text-[11px] leading-relaxed text-slate-700">
            {desc}
          </p>
        ) : (
          <p className="text-[11px] text-slate-400">
            Bu skill için henüz açıklama eklenmedi.
          </p>
        )}

        {row.extra_en && row.extra_en.length > 0 && (
          <ul className="mt-3 list-disc space-y-1 pl-4 text-[11px] text-slate-600">
            {row.extra_en.map((e: string, idx: number) => (
              <li key={idx}>{e}</li>
            ))}
          </ul>
        )}
      </section>

      {/* Runes */}
      <section className="rounded-xl border border-slate-200 bg-white/80 p-4 text-xs">
        <h2 className="mb-2 text-[11px] font-semibold text-slate-700">
          Runes
        </h2>
        {runes.length === 0 && (
          <p className="text-[11px] text-slate-400">
            Bu skill için rune bilgisi bulunamadı.
          </p>
        )}
        <div className="grid gap-3 md:grid-cols-3">
          {runes.map((rune: SkillRuneJson, idx: number) => {
            const rName = rune.name ?? `Rune #${idx + 1}`;
            const rDesc = (rune.description ?? []).join("\n") || null;

            return (
              <div
                key={`${rName}-${idx}`}
                className="rounded-lg border border-slate-200 bg-slate-50/60 p-3"
              >
                <div className="text-[11px] font-semibold text-slate-800">
                  {rName}
                </div>
                {rDesc ? (
                  <p className="mt-1 whitespace-pre-line text-[11px] text-slate-600">
                    {rDesc}
                  </p>
                ) : (
                  <p className="mt-1 text-[11px] text-slate-400">
                    Açıklama yok.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

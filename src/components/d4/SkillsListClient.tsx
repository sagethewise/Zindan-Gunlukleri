// src/components/d4/SkillsListClient.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type SkillListItem = {
  key: string;
  name_en: string | null;
  name_tr: string | null;
  class_key: string | null;
  tags: string[] | null;
  lucky_hit: string | null;
  fury_generate: number | null;
};

interface Props {
  skills: SkillListItem[];
}

export default function SkillsListClient({ skills }: Props) {
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");

  const classOptions = useMemo(() => {
    const set = new Set<string>();
    skills.forEach((s) => {
      if (s.class_key) set.add(s.class_key);
    });
    return Array.from(set).sort();
  }, [skills]);

  const filtered = useMemo(() => {
    return skills.filter((s) => {
      if (classFilter !== "all" && s.class_key !== classFilter) return false;

      if (!query.trim()) return true;
      const q = query.toLowerCase();

      const name =
        s.name_tr?.toLowerCase() ??
        s.name_en?.toLowerCase() ??
        s.key.toLowerCase();

      return (
        name.includes(q) ||
        (s.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [skills, classFilter, query]);

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-xs">
        <div className="flex gap-2">
          <select
            className="rounded-md border border-slate-200 px-2 py-1 text-[11px]"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          >
            <option value="all">Tüm class’lar</option>
            {classOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          placeholder="Skill ara…"
          className="min-w-[160px] flex-1 rounded-md border border-slate-200 px-2 py-1 text-[11px]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* List */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((s) => {
          const displayName =
            s.name_tr ?? s.name_en ?? s.key;

          return (
            <Link
              key={s.key}
              href={`/d4/skills/${s.key}`}
              className="group rounded-xl border border-slate-200 bg-white/80 p-3 text-xs shadow-sm hover:border-purple-400 hover:shadow-md transition"
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-800 group-hover:text-purple-700">
                  {displayName}
                </span>
                {s.class_key && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                    {s.class_key}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>
                  {s.fury_generate != null ? `Fury: ${s.fury_generate}` : "—"}
                </span>
                <span>
                  {s.lucky_hit ? `Lucky Hit: ${s.lucky_hit}` : "Lucky Hit: —"}
                </span>
              </div>
              {s.tags && s.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {s.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

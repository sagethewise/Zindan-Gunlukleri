/* eslint-disable @typescript-eslint/no-explicit-any */

// src/components/builds/BuildListClient.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export type D4ClassId =
  | "barbarian"
  | "druid"
  | "sorcerer"
  | "rogue"
  | "necromancer"
  | "spiritborn";

export type D4BuildType = "leveling" | "endgame";

export type BuildListItem = {
  id: string;
  slug: string;
  title: string;
  classId: D4ClassId;
  type: D4BuildType;
  season: number;
  pitLevel?: number | null;
  tags?: string[] | null;
};

interface Props {
  builds: BuildListItem[];
}

const CLASS_LABEL: Record<D4ClassId, string> = {
  barbarian: "Barbarian",
  druid: "Druid",
  sorcerer: "Sorcerer",
  rogue: "Rogue",
  necromancer: "Necromancer",
  spiritborn: "Spiritborn",
};

export default function BuildListClient({ builds }: Props) {
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState<D4ClassId | "all">("all");

  const filtered = useMemo(() => {
    return builds.filter((b) => {
      if (classFilter !== "all" && b.classId !== classFilter) return false;
      if (!query.trim()) return true;

      const q = query.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        CLASS_LABEL[b.classId].toLowerCase().includes(q) ||
        (b.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [builds, classFilter, query]);

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 items-center justify-between rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-xs">
        <div className="flex gap-2">
          <select
            className="rounded-md border border-slate-200 px-2 py-1 text-[11px]"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value as any)}
          >
            <option value="all">All Classes</option>
            {Object.entries(CLASS_LABEL).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          placeholder="Search builds…"
          className="min-w-[160px] flex-1 rounded-md border border-slate-200 px-2 py-1 text-[11px]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((b) => (
          <Link
            key={b.id}
            href={`/d4/builds/${b.slug}`}
            className="group rounded-xl border border-slate-200 bg-white/80 p-3 text-xs shadow-sm hover:border-purple-400 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[11px] font-semibold text-slate-800 group-hover:text-purple-700">
                {b.title}
              </span>
              <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] text-purple-700">
                S{b.season}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span>{CLASS_LABEL[b.classId]} · {b.type}</span>
              {b.pitLevel ? <span>Pit {b.pitLevel}</span> : null}
            </div>
            {b.tags && b.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {b.tags.map((tag) => (
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
        ))}
      </div>
    </div>
  );
}

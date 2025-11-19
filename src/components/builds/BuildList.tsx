// src/components/builds/BuildList.tsx
import Link from "next/link";
import type { D4Build } from "@/lib/types";
import type { BuildClassInfo } from "./BuildClassSidebar";

type BuildWithExtras = D4Build & {
  // Supabase'ten gelen ekstra alanlar (JSON'dan parse edilenler)
  skills?: { name: string }[];
};

interface BuildListProps {
  builds: BuildWithExtras[];
  classes: BuildClassInfo[];
  seasonLabel: string;
}

export default function BuildList({ builds, classes, seasonLabel }: BuildListProps) {
  if (!builds.length) {
    return (
      <div className="mt-6 rounded-xl border border-slate-300 bg-white/70 p-6 text-center text-sm text-slate-500 shadow">
        Bu filtreye uygun build bulunamadı.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {builds.map((b) => {
        const classInfo = classes.find((c) => c.id === b.classId);
        const skills: { name: string }[] = b.skills ?? [];

        return (
          <Link
            key={b.slug}
            href={`/build-firini/${b.slug}`}
            className="
              group relative flex flex-col overflow-hidden
              rounded-2xl border border-slate-200 bg-white/80 p-4
              shadow-md transition-all
              hover:-translate-y-1 hover:border-emerald-400 hover:shadow-xl
              backdrop-blur-xl
            "
          >
            {/* Glow efekti */}
            <div
              className="
              pointer-events-none absolute inset-x-0 top-0 h-20
              bg-gradient-to-b from-emerald-400/30 via-transparent to-transparent
              opacity-0 blur-xl transition-opacity
              group-hover:opacity-100
            "
            />

            {/* Üst bölüm: Class icon + type */}
            <div className="flex items-center justify-between">
              {classInfo && (
                <img
                  src={classInfo.icon}
                  alt={classInfo.label}
                  className="h-8 w-8 rounded-lg border border-slate-300 bg-white/50 shadow-md"
                />
              )}

              <span
                className="
                rounded-full bg-slate-100 px-2 py-1 text-[11px]
                font-medium text-slate-600
              "
              >
                {b.type === "endgame" ? "Endgame" : "Leveling"}
              </span>
            </div>

            {/* Başlık */}
            <h2
              className="
              mt-4 min-h-[48px] text-[15px] font-semibold text-slate-800
              line-clamp-2
            "
            >
              {b.title}
            </h2>

            {/* Skills chip (varsa) */}
            {skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.slice(0, 3).map((s, idx) => (
                  <span
                    key={`${b.slug}-skill-${idx}`}
                    className="
                      rounded-full bg-slate-200 px-2 py-0.5
                      text-[11px] font-medium text-slate-700
                    "
                  >
                    {s.name}
                  </span>
                ))}

                {skills.length > 3 && (
                  <span className="text-[11px] text-slate-500">
                    +{skills.length - 3} skill
                  </span>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
              <span>{seasonLabel}</span>
              <span
                className="
                text-emerald-600 font-medium
                group-hover:translate-x-0.5 transition-transform
              "
              >
                Detay →
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

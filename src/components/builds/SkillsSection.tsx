"use client";

import type { D4Skill } from "@/lib/types/d4Skills";
import SkillIcon from "./SkillIcon";

type SkillsSectionProps = {
  skills: D4Skill[];
};

export default function SkillsSection({ skills }: SkillsSectionProps) {
  // skill’leri build içindeki sıraya göre göstermek için map’lemeden önce sort edebilirsin
  return (
    <section className="mt-6">
      <h3 className="mb-3 text-sm font-semibold text-slate-200">Skills</h3>

      <div className="flex flex-wrap gap-4">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex items-center gap-2 rounded-xl bg-slate-900/40 px-3 py-2 ring-1 ring-slate-800"
          >
            <SkillIcon skill={skill} />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-100">
                {skill.name_tr || skill.name_en}
              </span>
              <span className="text-[10px] uppercase tracking-wide text-slate-500">
                {skill.class_en}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

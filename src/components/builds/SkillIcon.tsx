"use client";

import Image from "next/image";
import { useState } from "react";
import type { D4Skill } from "@/lib/types/d4Skills";
import { getSkillIconPath } from "@/lib/getSkillIconPath";

type SkillIconProps = {
  skill: D4Skill;
  size?: number;
};

export default function SkillIcon({ skill, size = 40 }: SkillIconProps) {
  const [open, setOpen] = useState(false);

  const title = skill.name_tr || skill.name_en || skill.key;
  const iconSrc = getSkillIconPath(skill);

  // description: tercihen raw.description array'i, yoksa description_tr/en
  const rawDescription =
    (skill.raw && Array.isArray(skill.raw.description) && skill.raw.description.join("\n")) ||
    skill.description_tr ||
    skill.description_en ||
    "";

  return (
    <div
      className="group relative inline-flex cursor-pointer"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900/60 ring-1 ring-slate-700">
        <Image
          src={iconSrc}
          alt={title}
          width={size}
          height={size}
          className="h-8 w-8 rounded-md object-contain"
        />
      </div>

      {/* Tooltip */}
      <div
        className={`pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-72 -translate-x-1/2 transform rounded-lg bg-slate-900/95 p-3 text-xs text-slate-100 shadow-xl transition
        ${open ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        <div className="mb-1 font-semibold text-slate-50">{title}</div>
        {skill.class_en && (
          <div className="mb-1 text-[10px] uppercase tracking-wide text-emerald-400">
            {skill.class_en}
          </div>
        )}
        <div className="whitespace-pre-line text-[11px] leading-snug text-slate-200">
          {rawDescription}
        </div>
      </div>
    </div>
  );
}

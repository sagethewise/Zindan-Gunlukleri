// src/components/builds/BuildClassSidebar.tsx
import {buildText} from "@/lib/build-i18n";
import type {Locale} from "@/lib/i18n";
import Image from "next/image";
import { D4ClassId } from "@/lib/types";

export interface BuildClassInfo {
  id: D4ClassId;
  label: string;
  icon?: string;
}

interface BuildClassSidebarProps {
  locale?:Locale;
  classes: BuildClassInfo[];
  selectedClass: D4ClassId;
  onSelectClass: (id: D4ClassId) => void;
}

export default function BuildClassSidebar({
  classes,
  locale="tr",
  selectedClass,
  onSelectClass,
}: BuildClassSidebarProps) {
  return (
    <aside className="hidden w-full max-w-xs flex-col rounded-lg bg-[#f5f2ec] md:flex">
      <div className="space-y-3 rounded-lg border border-slate-300  bg-gradient-to-r from-[#dbd3bf] via-[#e8e2d5] to-[#faf7f0] glass p-3">
        {classes.map((cls) => {
          const isActive = cls.id === selectedClass;
          return (
            <button
              key={cls.id}
              onClick={() => onSelectClass(cls.id)}
              className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-sm transition
                ${
                  isActive
                    ? "bg-gradient-to-r from-[#7c896e] via-[#a3ad90] to-[#c0c8ac] text-slate-700/70 shadow-lg shadow-stone-300/30"
                    : "text-slate-500 hover:bg-slate-300/70"
                }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-800">
                  {cls.icon?<Image
                    src={cls.icon}
                    alt={cls.label}
                    width={28}
                    height={28}
                    className="opacity-90"
                  />:<span aria-hidden="true" className="text-white text-xs">{cls.label.slice(0,2).toUpperCase()}</span>}
                </div>
                <span>{cls.label}</span>
              </div>

              <span
                className={`h-3 w-3 rounded-sm border ${
                  isActive
                    ? "border-stone-600 bg-stone-600/80"
                    : "border-slate-300 bg-slate-100"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-lg border border-slate-300 bg-[#e9e4d6] p-3 text-center text-[11px] text-stone-950">
        {buildText[locale].ads}
      </div>
    </aside>
  );
}

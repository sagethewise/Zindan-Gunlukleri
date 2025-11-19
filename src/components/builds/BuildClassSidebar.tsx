// src/components/builds/BuildClassSidebar.tsx
import Image from "next/image";
import { D4ClassId } from "@/lib/types";

export interface BuildClassInfo {
  id: D4ClassId;
  label: string;
  icon: string;
}

interface BuildClassSidebarProps {
  classes: BuildClassInfo[];
  selectedClass: D4ClassId;
  onSelectClass: (id: D4ClassId) => void;
}

export default function BuildClassSidebar({
  classes,
  selectedClass,
  onSelectClass,
}: BuildClassSidebarProps) {
  return (
    <aside className="hidden w-full max-w-xs flex-col rounded-lg bg-[#ffffff] md:flex">
      <div className="space-y-3 rounded-lg border border-slate-300  bg-gradient-to-r from-[#C3B3FF] via-[#E2D4FF] to-[#F8F4FF] glass p-3">
        {classes.map((cls) => {
          const isActive = cls.id === selectedClass;
          return (
            <button
              key={cls.id}
              onClick={() => onSelectClass(cls.id)}
              className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-sm transition
                ${
                  isActive
                    ? "bg-gradient-to-r from-[#8165e6] via-[#9e88ca] to-[#b19bd8] text-slate-700/70 shadow-lg shadow-purple-300/30"
                    : "text-slate-500 hover:bg-slate-300/70"
                }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-800">
                  <Image
                    src={cls.icon}
                    alt={cls.label}
                    width={28}
                    height={28}
                    className="opacity-90"
                  />
                </div>
                <span>{cls.label}</span>
              </div>

              <span
                className={`h-3 w-3 rounded-sm border ${
                  isActive
                    ? "border-purple-600 bg-purple-600/80"
                    : "border-slate-300 bg-slate-100"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-lg border border-slate-300 bg-[#d5c5ee] p-3 text-center text-[11px] text-purple-950">
        This website is supported by ads.
      </div>
    </aside>
  );
}

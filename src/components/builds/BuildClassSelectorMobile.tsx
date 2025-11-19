// src/components/builds/BuildClassSelectorMobile.tsx
import Image from "next/image";
import { D4ClassId } from "@/lib/types";
import type { BuildClassInfo } from "./BuildClassSidebar";

interface BuildClassSelectorMobileProps {
  classes: BuildClassInfo[];
  selectedClass: D4ClassId;
  onSelectClass: (id: D4ClassId) => void;
}

export default function BuildClassSelectorMobile({
  classes,
  selectedClass,
  onSelectClass,
}: BuildClassSelectorMobileProps) {
  return (
    <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1 md:hidden">
      {classes.map((cls) => {
        const isActive = cls.id === selectedClass;
        return (
          <button
            key={cls.id}
            onClick={() => onSelectClass(cls.id)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border text-[10px] font-semibold tracking-tight
              ${
                isActive
                  ? "border-purple-500 bg-purple-500/10 text-purple-900 shadow shadow-purple-400/40"
                  : "border-slate-300 bg-white text-slate-500 hover:border-purple-400/80 hover:text-purple-700"
              }`}
          >
            <Image
              src={cls.icon}
              alt={cls.label}
              width={24}
              height={24}
              className="opacity-90"
            />
          </button>
        );
      })}
    </div>
  );
}

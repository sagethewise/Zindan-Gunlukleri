// src/components/builds/GearListColumn.tsx
"use client";

import Image from "next/image";

export interface GearItem {
  slot: string;         // "Helm"
  aspectName: string;   // "Ramaladni's Magnum Opus"
  icon?: string;        // /images/items/barbarian/...
  tooltip?: string;     // hover’da gösterilecek metin
}

interface GearListColumnProps {
  title: string;
  items: GearItem[];
  align?: "left" | "right"; // sağ kolon için text-right
}

export default function GearListColumn({
  title,
  items,
  align = "left",
}: GearListColumnProps) {
  const textAlign =
    align === "right" ? "text-right items-end" : "text-left items-start";

  return (
    <div className="space-y-2 rounded-xl border border-purple-100 bg-white/95 p-3 text-[11px] shadow-sm">
      <h2 className="mb-2 text-xs font-semibold text-purple-900">{title}</h2>

      {items.length === 0 && (
        <p className="text-slate-400">
          Bu build için gear bilgisi henüz tanımlanmadı.
        </p>
      )}

      {items.map((item) => (
        <div
          key={item.slot}
          className="flex items-center gap-2 rounded-lg bg-purple-50/70 px-2 py-1"
        >
          {/* İkon + tooltip */}
          {item.icon && (
            <div className="relative group flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/90 shadow-sm">
                <Image
                  src={item.icon}
                  alt={item.aspectName}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>

              {/* Hover tooltip */}
              {item.tooltip && (
                <div
                  className="
                    pointer-events-none
                    absolute left-11 top-1/2 z-20
                    w-52 -translate-y-1/2
                    rounded-md border border-slate-200 bg-white/95 px-3 py-2
                    text-[10px] text-slate-700 shadow-lg
                    opacity-0 translate-x-[-4px]
                    group-hover:opacity-100 group-hover:translate-x-0
                    transition-all duration-150
                  "
                >
                  <div className="mb-1 text-[11px] font-semibold text-purple-900">
                    {item.aspectName}
                  </div>
                  <p className="leading-snug">{item.tooltip}</p>
                </div>
              )}
            </div>
          )}

          {/* Metin kısmı */}
          <div className={`flex flex-col gap-0.5 ${textAlign}`}>
            <div className="text-[11px] font-semibold text-slate-800">
              {item.aspectName}
            </div>
            <div className="text-[10px] text-slate-500">{item.slot}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

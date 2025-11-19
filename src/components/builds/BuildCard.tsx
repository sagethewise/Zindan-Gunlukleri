// src/components/builds/BuildCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { D4Build } from "@/lib/types";
import type { BuildClassInfo } from "./BuildClassSidebar";
import { BUILD_ICON_FILES } from "@/lib/buildIconMap";

interface BuildCardProps {
  build: D4Build;
  classes: BuildClassInfo[];
}

export default function BuildCard({ build, classes }: BuildCardProps) {
  const cls = classes.find((c) => c.id === build.classId);
  const iconFiles = BUILD_ICON_FILES[build.slug] ?? [];

  return (
    <Link
      href={`/build-firini/${build.slug}`}
      className="flex w-full flex-col gap-3 rounded-md border border-slate-200 bg-white p-3 text-left text-xs text-slate-700 transition hover:border-purple-400/80 hover:bg-purple-50/40"
    >
      {/* Üst satır */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-800">
            {cls && (
              <Image
                src={cls.icon}
                alt={cls.label}
                width={28}
                height={28}
                className="opacity-90"
              />
            )}
          </div>
          <div>
            <div className="text-xs font-semibold">{build.title}</div>
            <div className="text-[10px] text-slate-500">
              Season {build.season}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {build.pitLevel ? (
            <div className="rounded-md bg-slate-800 px-2 py-1 text-[10px] text-slate-100">
              Pit {build.pitLevel}
            </div>
          ) : null}
          <span className="text-lg text-slate-400">›</span>
        </div>
      </div>

      {/* Alt satır: Skills + Tagler */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-1 gap-1">
          {iconFiles.length === 0 ? (
            <>
              <div className="h-7 w-7 rounded bg-slate-200" />
              <div className="h-7 w-7 rounded bg-slate-200" />
              <div className="h-7 w-7 rounded bg-slate-200" />
              <div className="h-7 w-7 rounded bg-slate-200" />
            </>
          ) : (
            iconFiles.map((file) => (
              <div
                key={file}
                className="h-7 w-7 overflow-hidden rounded bg-slate-200"
              >
                <Image
                  src={`/images/builds/${build.classId}/${file}`}
                  alt={file}
                  width={28}
                  height={28}
                  className="h-full w-full object-contain"
                />
              </div>
            ))
          )}
        </div>

        {build.tags && build.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {build.tags.map((t) => (
              <span
                key={t}
                className="rounded bg-slate-900 px-2 py-0.5 text-[10px] text-slate-100"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

// src/lib/buildDetailLayout.tsx
import type { ReactNode } from "react";
import type { D4Build } from "@/lib/types";

export interface BuildDetailLayoutProps {
  build: D4Build;
  children: ReactNode;
}

export function BuildDetailLayout({ build, children }: BuildDetailLayoutProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-800">{build.title}</h1>
        <p className="text-sm text-slate-500">
          {build.classId.toUpperCase()} · Season {build.season}
        </p>
      </div>

      {/* Content */}
      <div>{children}</div>
    </div>
  );
}

export default BuildDetailLayout;

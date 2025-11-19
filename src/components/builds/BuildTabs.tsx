// src/components/builds/BuildTabs.tsx
import { D4BuildType } from "@/lib/types";

interface BuildTabsProps {
  selectedTab: D4BuildType;
  onChangeTab: (tab: D4BuildType) => void;
}

export default function BuildTabs({ selectedTab, onChangeTab }: BuildTabsProps) {
  return (
    <div className="mb-3 border-b border-slate-300">
      <div className="flex gap-6">
        <button
          onClick={() => onChangeTab("leveling")}
          className={`pb-2 text-xs font-semibold tracking-wide
            ${
              selectedTab === "leveling"
                ? "border-b-2 border-purple-400 text-purple-700"
                : "text-purple-400 hover:text-purple-600"
            }`}
        >
          Leveling
        </button>
        <button
          onClick={() => onChangeTab("endgame")}
          className={`pb-2 text-xs font-semibold tracking-wide
            ${
              selectedTab === "endgame"
                ? "border-b-2 border-purple-400 text-purple-700"
                : "text-purple-400 hover:text-purple-600"
            }`}
        >
          Endgame
        </button>
      </div>
    </div>
  );
}

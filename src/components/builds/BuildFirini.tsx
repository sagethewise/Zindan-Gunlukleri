// src/components/builds/BuildFirini.tsx
"use client";

import { useMemo, useState } from "react";
import { D4Build, D4BuildType, D4ClassId } from "@/lib/types";
import BuildFiriniBanner from "./BuildFiriniBanner";
import BuildSearchInput from "./BuildSearchInput";
import BuildClassSidebar, { BuildClassInfo } from "./BuildClassSidebar";
import BuildClassSelectorMobile from "./BuildClassSelectorMobile";
import BuildTabs from "./BuildTabs";
import BuildMetaHeader from "./BuildMetaHeader";
import BuildList from "./BuildList";

interface BuildFiriniProps {
  season: number;      // 10, 11 ...
  isCurrent?: boolean; // /build-firini'nde true, arşiv sayfalarında false
   builds: D4Build[];   // 
}

const CLASSES: BuildClassInfo[] = [
  { id: "barbarian", label: "Barbarian", icon: "/images/classes/barbarian.png" },
  { id: "druid", label: "Druid", icon: "/images/classes/druid.png" },
  { id: "sorcerer", label: "Sorcerer", icon: "/images/classes/sorcererr.png" },
  { id: "rogue", label: "Rogue", icon: "/images/classes/rogue.png" },
  { id: "necromancer", label: "Necromancer", icon: "/images/classes/necromancer.png" },
  { id: "spiritborn", label: "Spiritborn", icon: "/images/classes/spiritborn.png" },
];

export default function BuildFirini({ season, isCurrent, builds }: BuildFiriniProps) {
  const [selectedClass, setSelectedClass] = useState<D4ClassId>("druid");
  const [selectedTab, setSelectedTab] = useState<D4BuildType>("endgame");
  const [search, setSearch] = useState<string>("");

  const seasonLabel = `Season ${season}`;

const filteredBuilds = useMemo(
  () =>
    builds.filter((b: D4Build) => {
      if (b.season !== season) return false;
      if (b.classId !== selectedClass) return false;
      if (b.type !== selectedTab) return false;

      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        (Array.isArray(b.tags) && b.tags.some((t: string) => t.toLowerCase().includes(q)))
      );
    }),
  [builds, season, selectedClass, selectedTab, search]
);

  return (
    <div className="min-h-screen bg-[#ffffff] text-slate-600">
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Banner + Search */}
        <BuildFiriniBanner season={season} isCurrent={isCurrent}>
          <BuildSearchInput search={search} onSearchChange={setSearch} />
        </BuildFiriniBanner>

        {/* Ana Layout */}
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Sol: Sidebar */}
          <BuildClassSidebar
            classes={CLASSES}
            selectedClass={selectedClass}
            onSelectClass={setSelectedClass}
          />

          {/* Sağ Panel */}
          <main className="flex-1">
            {/* Mobil Class Selector */}
            <BuildClassSelectorMobile
              classes={CLASSES}
              selectedClass={selectedClass}
              onSelectClass={setSelectedClass}
            />

            {/* Tabs */}
            <BuildTabs selectedTab={selectedTab} onChangeTab={setSelectedTab} />

            {/* Meta Header */}
            <BuildMetaHeader />

            {/* Build List */}
            <BuildList
              builds={filteredBuilds}
              classes={CLASSES}
              seasonLabel={seasonLabel}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

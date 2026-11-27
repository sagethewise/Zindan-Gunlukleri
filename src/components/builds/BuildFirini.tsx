// src/components/builds/BuildFirini.tsx
"use client";

import Link from "next/link";
import {TARGET_D4_SEASON,LEGACY_D4_SEASON,D4_SEASON_16,season16Status} from "@/lib/constants";
import {seasonCopy} from "@/lib/forge-season-copy";
import {catalogCopy} from "@/lib/forge-catalog-copy";
import {forgeCopy} from "@/lib/forge-copy";
import { messages,localizedPath, type Locale } from "@/lib/i18n";
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
  locale?:Locale;
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

export default function BuildFirini({ season, builds, locale="tr" }: BuildFiriniProps) {
  const [selectedClass, setSelectedClass] = useState<D4ClassId>("druid");
  const [selectedTab, setSelectedTab] = useState<D4BuildType>("endgame");
  const [search, setSearch] = useState<string>("");

  const c=forgeCopy[locale],sc=seasonCopy[locale],target=season===TARGET_D4_SEASON;
  const seasonPath=(n:number)=>localizedPath(locale,"forge",(locale==="de"?"saison":"season")+"/"+n);
  const classes=target?[...CLASSES,{id:"paladin" as const,label:"Paladin"},{id:"warlock" as const,label:"Warlock"}]:CLASSES;
  const seasonLabel = `${messages[locale].season} ${season}`;

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
    <div className="min-h-screen bg-[#f5f2ec] text-slate-600">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="fp-warning mb-5"><div><strong>{target?sc.target:sc.archive}</strong><p className="mt-1">{target?(season16Status()==="upcoming"?sc.upcoming:sc.checkLive):seasonLabel}</p></div><div className="flex flex-wrap gap-2"><Link href={localizedPath(locale,"forge","database")} className="dd-button secondary">{catalogCopy[locale].title} →</Link><Link href={localizedPath(locale,"forge","planner")} className="dd-button primary">{c.goPlanner} →</Link></div></div>
        <nav aria-label={messages[locale].season} className="flex flex-wrap gap-2 mb-4"><Link href={localizedPath(locale,"forge")} className={target?"dd-button primary":"dd-button secondary"} aria-current={target?"page":undefined}>{sc.targetLink}</Link><Link href={seasonPath(LEGACY_D4_SEASON)} className={!target?"dd-button primary":"dd-button secondary"} aria-current={!target?"page":undefined}>{sc.archiveLink}</Link></nav>
        {target&&<section className="fp-workspace mb-5"><p className="dd-kicker">DIABLO IV · {sc.plannedPatch} {D4_SEASON_16.patch}</p><h2 className="text-xl font-semibold mt-2">{sc.name}</h2><p className="mt-2 text-sm">{sc.pendingBody}</p><div className="flex flex-wrap gap-4 mt-4"><a href={D4_SEASON_16.announcement} target="_blank" rel="noreferrer" className="dd-text-link">{sc.source} ↗</a><a href={D4_SEASON_16.patchNotes} target="_blank" rel="noreferrer" className="dd-text-link">{sc.notes} ↗</a><a href="https://d4builds.gg/?var=0" target="_blank" rel="noreferrer" className="dd-text-link">{sc.sourceLink} ↗</a></div><p className="text-xs mt-3">{sc.sourceNote}</p></section>}
        {/* Banner + Search */}
        <BuildFiriniBanner season={season} isCurrent={false} locale={locale}>
          <BuildSearchInput search={search} onSearchChange={setSearch} placeholder={messages[locale].searchBuild} />
        </BuildFiriniBanner>

        {/* Ana Layout */}
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Sol: Sidebar */}
          <BuildClassSidebar locale={locale}
            classes={classes}
            selectedClass={selectedClass}
            onSelectClass={setSelectedClass}
          />

          {/* Sağ Panel */}
          <main className="flex-1">
            {/* Mobil Class Selector */}
            <BuildClassSelectorMobile
              classes={classes}
              selectedClass={selectedClass}
              onSelectClass={setSelectedClass}
            />

            {/* Tabs */}
            <BuildTabs selectedTab={selectedTab} onChangeTab={setSelectedTab} />

            {/* Meta Header */}
            {target?<h2 className="text-lg font-semibold mb-3">{sc.pending}</h2>:<BuildMetaHeader locale={locale} />}

            {/* Build List */}
            <BuildList
              builds={filteredBuilds}
              classes={classes}
              seasonLabel={seasonLabel} locale={locale}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

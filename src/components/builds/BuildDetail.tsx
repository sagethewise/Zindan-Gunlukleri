/* eslint-disable @typescript-eslint/no-explicit-any */

// src/components/builds/BuildDetail.tsx
"use client";

import GearArchiveDialog from "./GearArchiveDialog";
import {gearCopy} from "@/lib/forge-gear-copy";
import { buildText,gearLabel } from "@/lib/build-i18n";
import { messages,type Locale } from "@/lib/i18n";
import { useEffect, useState } from "react";
import Image from "next/image";
import { D4Build } from "@/lib/types";
import ChaosPerksRing from "./ChaosPerksRing";
import { supabaseBuilds } from "@/lib/supabase-builds";
import {
  GearSlotKey,
  LEFT_GEAR_SLOTS,
  RIGHT_GEAR_SLOTS,
} from "@/lib/types";

type DetailTab = "gear" | "skills" | "paragon" | "mercs" | "notes";

interface Rune {
  name: string;
  icon: string;
}


// 🔧 Supabase join tipleri – DİKKAT: d4_* alanları ARRAY!
interface GearRow {
  id: string;
  build_id: string;
  slot_key: GearSlotKey;
  unique_name: string | null;
  aspect_name: string | null;
  icon_key: string | null;
  item_id: string | null;
  d4_items?: {
    id: string;
    slug: string;
    name_en: string | null;
    name_tr: string | null;
    slot_key: string | null;
    icon_key: string | null;
    class_key: string | null;
  }[] | null;
}

interface RuneRow {
  id: string;
  rune_slot: number;
  d4_runes?: {
    id: string;
    key: string;
    name_en: string | null;
    name_tr: string | null;
    icon_key: string | null;
  }[] | null;
}


/**
 * Ortak ikon seti:
 * Tüm class’lar için slot bazlı tek ikon (lokalde kayıtlı).
 * → /public/images/gear altındaki placeholder’lar
 */
const SLOT_ICONS: Record<GearSlotKey, string> = {
  helm: "/images/gear/helm.png",
  chest_armor: "/images/gear/chest_armor.png",
  gloves: "/images/gear/gloves.png",
  pants: "/images/gear/pants.png",
  boots: "/images/gear/boots.png",
  bludgeoning_weapon: "/images/gear/bludgeoning_weapon.png",
  dual_wield_weapon_1: "/images/gear/dual_wield_weapon_1.png",
  amulet: "/images/gear/amulet.png",
  ring_1: "/images/gear/ring_1.png",
  ring_2: "/images/gear/ring_2.png",
  slashing_weapon: "/images/gear/slashing_weapon.png",
  dual_wield_weapon_2: "/images/gear/dual_wield_weapon_2.png",
};

// Slot icon helper
function resolveIconPath(slotKey: GearSlotKey) {
  return SLOT_ICONS[slotKey] ?? "/images/gear/placeholder.png";
}

// Eğer DB'den rune/skill gelmezse barbarian için fallback:
interface BuildDetailProps {
  locale?:Locale;
  build: D4Build & {
    // d4_homepage_builds.data / skills gibi ekstralar gelebilir
    skills?: { name: string }[];
    rawData?: any;
    creator?: string | null;
    pit?: number | null;
    tier?: number | null;
    buildUuid?: string | null;
  };
}

export default function BuildDetail({ build,locale="tr" }: BuildDetailProps) {
  const t=buildText[locale],gc=gearCopy[locale];
  const [inspectSlot,setInspectSlot]=useState<GearSlotKey|null>(null);
  const [gearError,setGearError]=useState(false);
  const [tab, setTab] = useState<DetailTab>("gear");

  const [gear, setGear] = useState<GearRow[]>([]);
  const [runes, setRunes] = useState<Rune[]>([]);
  

  const [loadingGear, setLoadingGear] = useState(false);
  const [loadingRunes, setLoadingRunes] = useState(false);


  const buildTitleLine = `${build.title} (S${build.season})`;

  // Existing archived build gear; only exact build associations, never guessed assignments.
  useEffect(() => {
    let active=true;
    async function loadGear(){
      setLoadingGear(true);setGear([]);setGearError(false);
      try{
        let id=build.id;
        if(build.buildUuid){
          const {data,error}=await supabaseBuilds.from("d4_build_details").select("id").eq("buildid",build.buildUuid).eq("season",build.season).maybeSingle();
          if(!error&&data?.id)id=data.id;
        }
        const {data,error}=await supabaseBuilds.from("build_gear_slots").select("id,build_id,slot_key,unique_name,aspect_name,icon_key,item_id").eq("build_id",id);
        if(error)throw error;
        if(active)setGear((data??[]) as GearRow[]);
      }catch{if(active)setGearError(true)}
      finally{if(active)setLoadingGear(false)}
    }
    void loadGear();return()=>{active=false};
  }, [build.id,build.buildUuid,build.season]);

  // ❷ Runes Supabase'den (yoksa dummy)
  useEffect(() => {
    async function loadRunes() {
      setLoadingRunes(true);

      const { data, error } = await supabaseBuilds
        .from("build_runes")
        .select(
          `
          id,
          rune_slot,
          d4_runes (
            id,
            key,
            name_en,
            name_tr,
            icon_key
          )
        `
        )
        .eq("build_id", build.id)
        .order("rune_slot", { ascending: true });

      if (error) {
        console.error("Error fetching build runes", error);
        setRunes([]);
      } else if (!data || data.length === 0) {
        setRunes([]);
      } else {
        const mapped: Rune[] = (data as unknown as RuneRow[]).map((row) => {
          const r = row.d4_runes?.[0];

          const name =
            (locale==="tr" ? r?.name_tr || r?.name_en : r?.name_en || r?.name_tr) || r?.key || "Rune";

          // 🔹 /public/images/runes altındaki ikonlar
          const icon = r?.icon_key
            ? `/images/runes/${r.icon_key}.png`
            : "/images/runes/placeholder.png";

          return { name, icon };
        });

        setRunes(mapped);
      }

      setLoadingRunes(false);
    }

    loadRunes();
  }, [build.id, build.classId,locale]);


  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-3 border-b border-stone-100 pb-3 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-stone-100">
            <Image
              src={`/images/classes/${build.classId}.png`}
              alt={build.classId}
              width={32}
              height={32}
            />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-800 md:text-base">
              {buildTitleLine}
            </h1>
            <p className="text-[11px] text-slate-500">
              {build.classId.charAt(0).toUpperCase() +
                build.classId.slice(1)}{" "}
              Build
            </p>
          </div>
        </div>
      </div>

      {/* TAB MENÜSÜ */}
      <div className="flex items-center gap-4 border-b border-stone-100 text-[11px] font-medium">
        {(["gear", "skills", "paragon", "mercs", "notes"] as DetailTab[]).map(
          (key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`pb-2 ${
                tab === key
                  ? "border-b-2 border-stone-500 text-stone-700"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {key === "gear" && t.gear}
              {key === "skills" && t.skills}
              {key === "paragon" && t.paragon}
              {key === "mercs" && t.mercs}
              {key === "notes" && t.notes}
            </button>
          )
        )}
      </div>

      {tab==="gear"&&<div className="fp-warning"><div><strong>{gc.archive}</strong><p>{gearError?gc.missing:gc.archiveDetail}</p></div></div>}
      {/* GEAR TAB – 3 kolon layout */}
      {tab === "gear" && (
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1.6fr_1.2fr]">
          {/* SOL KOLON */}
          <div className="space-y-2 rounded-2xl bg-white/80 p-3 shadow-sm ring-1 ring-stone-100">
            <h2 className="mb-2 text-xs font-semibold text-slate-700">
              {t.left}
            </h2>

            {loadingGear && (
              <p className="text-[11px] text-slate-400">{t.loading}</p>
            )}

            {!loadingGear &&
              LEFT_GEAR_SLOTS.map((slotKey) => {
                const row = gear.find((g) => g.slot_key === slotKey);
                const baseItem = row?.d4_items?.[0];

                const displayName =
                  (locale==="tr" ? baseItem?.name_tr || baseItem?.name_en : baseItem?.name_en || baseItem?.name_tr) ||
                  row?.unique_name || row?.aspect_name || "—";

                return (
                  <button type="button"
                    key={slotKey}
                    onClick={()=>setInspectSlot(slotKey)}
                    title={gc.inspect+" · "+gearLabel(locale,slotKey)}
                    className="fg-build-slot"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-900/90">
                      <Image
                        src={resolveIconPath(slotKey)}
                        alt={displayName}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className={row?.unique_name?"fg-unique":row?.aspect_name?"fg-aspect":"text-slate-600"}>
                        {displayName}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {gearLabel(locale,slotKey)}
                      </span>
                    </div>
                    <span className="fg-slot-action">↗</span>
                  </button>
                );
              })}
          </div>

          {/* ORTA KOLON – Chaos Perks + Runes + Skills */}
          <div className="space-y-4 rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-stone-100">
            {/* Season badge */}
            <div className="mb-2 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">{messages[locale].season}</span>
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-800">
                {messages[locale].season} {build.season}
              </span>
            </div>

            {/* Chaos Perks Ring */}
            <div className="relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-stone-50 via-slate-50 to-stone-100 py-6 md:py-10">
              <ChaosPerksRing classId={build.classId} />
            </div>

            {/* {t.runes} */}
            <div>
              <h3 className="mb-2 text-xs font-semibold text-slate-700">
                {t.runes}
              </h3>
              <div className="flex flex-wrap gap-3">
                {loadingRunes && (
                  <span className="text-[11px] text-slate-400">
                    {t.loading}
                  </span>
                )}
                {!loadingRunes && runes.length === 0 && (
                  <span className="text-[11px] text-slate-400">
                    {t.noRunes}
                  </span>
                )}
                {!loadingRunes &&
                  runes.map((rune) => (
                    <div
                      key={rune.name}
                      className="flex flex-col items-center gap-1 text-[10px]"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded bg-slate-900/90">
                        <Image
                          src={rune.icon}
                          alt={rune.name}
                          width={28}
                          height={28}
                        />
                      </div>
                      <span className="text-slate-600">{rune.name}</span>
                    </div>
                  ))}
              </div>
            </div>


          </div>

          {/* SAĞ KOLON */}
          <div className="space-y-2 rounded-2xl bg-white/80 p-3 shadow-sm ring-1 ring-stone-100">
            <h2 className="mb-2 text-xs font-semibold text-slate-700">
              {t.right}
            </h2>

            {loadingGear && (
              <p className="text-[11px] text-slate-400">{t.loading}</p>
            )}

            {!loadingGear &&
              RIGHT_GEAR_SLOTS.map((slotKey) => {
                const row = gear.find((g) => g.slot_key === slotKey);
                const baseItem = row?.d4_items?.[0];

                const displayName =
                  (locale==="tr" ? baseItem?.name_tr || baseItem?.name_en : baseItem?.name_en || baseItem?.name_tr) ||
                  row?.unique_name || row?.aspect_name || "—";

                return (
                  <button type="button"
                    key={slotKey}
                    onClick={()=>setInspectSlot(slotKey)}
                    title={gc.inspect+" · "+gearLabel(locale,slotKey)}
                    className="fg-build-slot"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-900/90">
                      <Image
                        src={resolveIconPath(slotKey)}
                        alt={displayName}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className={row?.unique_name?"fg-unique":row?.aspect_name?"fg-aspect":"text-slate-600"}>
                        {displayName}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {gearLabel(locale,slotKey)}
                      </span>
                    </div>
                    <span className="fg-slot-action">↗</span>
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {inspectSlot&&<GearArchiveDialog key={inspectSlot} locale={locale} slot={inspectSlot} slotLabel={gearLabel(locale,inspectSlot)} classKey={build.classId} assigned={{item:gear.find(g=>g.slot_key===inspectSlot)?.unique_name??undefined,aspect:gear.find(g=>g.slot_key===inspectSlot)?.aspect_name??undefined}} onClose={()=>setInspectSlot(null)}/>}
      {/* DİĞER TABLAR – şimdilik placeholder */}
      {tab === "skills" && (
        <div className="rounded-2xl bg-white/80 p-4 text-[11px] text-slate-700 shadow-sm ring-1 ring-stone-100">
          {t.unavailable}
        </div>
      )}
      {tab === "paragon" && (
        <div className="rounded-2xl bg-white/80 p-4 text-[11px] text-slate-700 shadow-sm ring-1 ring-stone-100">
          {t.unavailable}
        </div>
      )}
      {tab === "mercs" && (
        <div className="rounded-2xl bg-white/80 p-4 text-[11px] text-slate-700 shadow-sm ring-1 ring-stone-100">
          {t.unavailable}
        </div>
      )}
      {tab === "notes" && (
        <div className="rounded-2xl bg-white/80 p-4 text-[11px] text-slate-700 shadow-sm ring-1 ring-stone-100">
          {t.unavailable}
        </div>
      )}
    </div>
  );
}

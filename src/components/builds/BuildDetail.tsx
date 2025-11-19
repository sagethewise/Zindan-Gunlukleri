// src/components/builds/BuildDetail.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { D4Build } from "@/lib/types";
import ChaosPerksRing from "./ChaosPerksRing";
import { supabaseBuilds } from "@/lib/supabase-builds";
import {
  GearSlotKey,
  GEAR_SLOT_LABELS,
  LEFT_GEAR_SLOTS,
  RIGHT_GEAR_SLOTS,
} from "@/lib/types";

type DetailTab = "gear" | "skills" | "paragon" | "mercs" | "notes";

interface Rune {
  name: string;
  icon: string;
}

interface SkillIcon {
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

interface SkillRow {
  id: string;
  skill_slot: number;
  d4_skills?: {
    id: string;
    key: string;
    name_en: string | null;
    name_tr: string | null;
    icon_key: string | null;
    class_key: string | null;
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
function getBarbarianDummyRunes(): Rune[] {
  return [
    { name: "Igni", icon: "/images/runes/moni.png" },
    { name: "Tec", icon: "/images/runes/tec.png" },
    { name: "Moni", icon: "/images/runes/cir.png" },
    { name: "Qax", icon: "/images/runes/gar.png" },
  ];
}

function getBarbarianDummySkills(): SkillIcon[] {
  return [
    {
      name: "Lunging Strike",
      icon: "/images/builds/barbarian/lunging_strike.png",
    },
    {
      name: "Whirlwind",
      icon: "/images/builds/barbarian/whirlwind.png",
    },
    {
      name: "Rallying Cry",
      icon: "/images/builds/barbarian/rallying_cry.png",
    },
    {
      name: "War Cry",
      icon: "/images/builds/barbarian/war_cry.png",
    },
    {
      name: "Challenging Shout",
      icon: "/images/builds/barbarian/challenging_shout.png",
    },
    {
      name: "Wrath of the Berserker",
      icon: "/images/builds/barbarian/wrath_of_the_berserker.png",
    },
  ];
}

interface BuildDetailProps {
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

export default function BuildDetail({ build }: BuildDetailProps) {
  const [tab, setTab] = useState<DetailTab>("gear");

  const [gear, setGear] = useState<GearRow[]>([]);
  const [runes, setRunes] = useState<Rune[]>([]);
  const [skillBar, setSkillBar] = useState<SkillIcon[]>([]);

  const [loadingGear, setLoadingGear] = useState(false);
  const [loadingRunes, setLoadingRunes] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(false);

  const updatedAt = "September 17, 2025"; // şimdilik sabit
  const buildTitleLine = `${build.title} (S${build.season})`;

  // ❶ Gear slotlarını Supabase'den çek
  useEffect(() => {
    async function loadGear() {
      setLoadingGear(true);

const { data, error } = await supabaseBuilds
  .from("d4_build_details")
  .select(
    `
    id,
    build_uuid,
    slug,
    name_en,
    name_tr,
    tier,
    season,
    content,
    pit,
    class_en,
    class_key,
    skills,
    chaos_perks,
    data,
    created_at,
    updated_at
  `
  )
  .eq("slug", build.slug)
  .single();


      if (error) {
        console.error("Error fetching build gear", error);
        setGear([]);
      } else {
        setGear((data ?? []) as unknown as GearRow[]);
      }

      setLoadingGear(false);
    }

    loadGear();
  }, [build.id]);

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
        if (build.classId === "barbarian") {
          setRunes(getBarbarianDummyRunes());
        } else {
          setRunes([]);
        }
      } else if (!data || data.length === 0) {
        if (build.classId === "barbarian") {
          setRunes(getBarbarianDummyRunes());
        } else {
          setRunes([]);
        }
      } else {
        const mapped: Rune[] = (data as unknown as RuneRow[]).map((row) => {
          const r = row.d4_runes?.[0];

          const name =
            r?.name_tr || r?.name_en || r?.key || "Rune";

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
  }, [build.id, build.classId]);

  // ❸ Skills Supabase'den (yoksa rawData.skills / build.skills / dummy)
  useEffect(() => {
    async function loadSkills() {
      setLoadingSkills(true);

      const { data, error } = await supabaseBuilds
        .from("build_skills")
        .select(
          `
          id,
          skill_slot,
          d4_skills (
            id,
            key,
            name_en,
            name_tr,
            icon_key,
            class_key
          )
        `
        )
        .eq("build_id", build.id)
        .order("skill_slot", { ascending: true });

      if (error) {
        console.error("Error fetching build skills", error);

        // 🔹 Supabase hata verirse → JSON’dan skills dene, yoksa dummy
        const rawSkills: { name: string }[] =
          (build.skills as any) ??
          (build.rawData?.skills as { name: string }[] | undefined) ??
          [];

        if (rawSkills.length > 0) {
          setSkillBar(
            rawSkills.map((s) => ({
              name: s.name,
              icon: `/images/builds/${build.classId}/placeholder.png`,
            }))
          );
        } else if (build.classId === "barbarian") {
          setSkillBar(getBarbarianDummySkills());
        } else {
          setSkillBar([]);
        }
      } else if (!data || data.length === 0) {
        // 🔹 DB’de skill kaydı yoksa → önce JSON’dan dene
        const rawSkills: { name: string }[] =
          (build.skills as any) ??
          (build.rawData?.skills as { name: string }[] | undefined) ??
          [];

        if (rawSkills.length > 0) {
          setSkillBar(
            rawSkills.map((s) => ({
              name: s.name,
              icon: `/images/builds/${build.classId}/placeholder.png`,
            }))
          );
        } else if (build.classId === "barbarian") {
          setSkillBar(getBarbarianDummySkills());
        } else {
          setSkillBar([]);
        }
      } else {
        // 🔹 DB’de skill kaydı varsa → d4_skills join + icon_key
        const mapped: SkillIcon[] = (data as unknown as SkillRow[]).map(
          (row) => {
            const s = row.d4_skills?.[0];

            const name =
              s?.name_tr || s?.name_en || s?.key || "Skill";

            const icon = s?.icon_key
              ? `/images/builds/${build.classId}/${s.icon_key}.png`
              : `/images/builds/${build.classId}/placeholder.png`;

            return { name, icon };
          }
        );

        setSkillBar(mapped);
      }

      setLoadingSkills(false);
    }

    loadSkills();
  }, [build.id, build.classId, build.skills, build.rawData]);

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-3 border-b border-purple-100 pb-3 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-purple-100">
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
              Build · Updated on {updatedAt}
            </p>
          </div>
        </div>
      </div>

      {/* TAB MENÜSÜ */}
      <div className="flex items-center gap-4 border-b border-purple-100 text-[11px] font-medium">
        {(["gear", "skills", "paragon", "mercs", "notes"] as DetailTab[]).map(
          (key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`pb-2 ${
                tab === key
                  ? "border-b-2 border-purple-500 text-purple-700"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {key === "gear" && "Gear & Skills"}
              {key === "skills" && "Skill Tree"}
              {key === "paragon" && "Paragon"}
              {key === "mercs" && "Mercenaries"}
              {key === "notes" && "Notes"}
            </button>
          )
        )}
      </div>

      {/* GEAR TAB – 3 kolon layout */}
      {tab === "gear" && (
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1.6fr_1.2fr]">
          {/* SOL KOLON */}
          <div className="space-y-2 rounded-2xl bg-white/80 p-3 shadow-sm ring-1 ring-purple-100">
            <h2 className="mb-2 text-xs font-semibold text-slate-700">
              Aspects (Left)
            </h2>

            {loadingGear && (
              <p className="text-[11px] text-slate-400">Loading gear…</p>
            )}

            {!loadingGear &&
              LEFT_GEAR_SLOTS.map((slotKey) => {
                const row = gear.find((g) => g.slot_key === slotKey);
                const baseItem = row?.d4_items?.[0];

                const displayName =
                  baseItem?.name_tr ||
                  baseItem?.name_en ||
                  row?.unique_name ||
                  "—";

                return (
                  <div
                    key={slotKey}
                    className="flex items-center gap-3 rounded-lg bg-purple-50/80 px-3 py-2"
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
                      <span className="text-xs font-semibold text-emerald-600">
                        {displayName}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {GEAR_SLOT_LABELS[slotKey]}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* ORTA KOLON – Chaos Perks + Runes + Skills */}
          <div className="space-y-4 rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-purple-100">
            {/* Season badge */}
            <div className="mb-2 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Season</span>
              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-800">
                Season {build.season}
              </span>
            </div>

            {/* Chaos Perks Ring */}
            <div className="relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-50 via-slate-50 to-purple-100 py-6 md:py-10">
              <ChaosPerksRing classId={build.classId} />
            </div>

            {/* Active Runes */}
            <div>
              <h3 className="mb-2 text-xs font-semibold text-slate-700">
                Active Runes
              </h3>
              <div className="flex flex-wrap gap-3">
                {loadingRunes && (
                  <span className="text-[11px] text-slate-400">
                    Loading runes…
                  </span>
                )}
                {!loadingRunes && runes.length === 0 && (
                  <span className="text-[11px] text-slate-400">
                    Bu build için rune verisi eklenmedi.
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

            {/* Skills */}
            <div>
              <h3 className="mb-2 text-xs font-semibold text-slate-700">
                Skills
              </h3>
              <div className="flex flex-wrap gap-3">
                {loadingSkills && (
                  <span className="text-[11px] text-slate-400">
                    Loading skills…
                  </span>
                )}
                {!loadingSkills && skillBar.length === 0 && (
                  <span className="text-[11px] text-slate-400">
                    Skill ikonları için veri eklenmedi.
                  </span>
                )}
                {!loadingSkills &&
                  skillBar.map((s) => (
                    <div
                      key={s.name}
                      className="flex flex-col items-center gap-1 text-[10px]"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded bg-slate-900/90">
                        <Image
                          src={s.icon}
                          alt={s.name}
                          width={28}
                          height={28}
                          className="object-contain"
                        />
                      </div>
                      <span className="max-w-[80px] text-center text-slate-600">
                        {s.name}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* SAĞ KOLON */}
          <div className="space-y-2 rounded-2xl bg-white/80 p-3 shadow-sm ring-1 ring-purple-100">
            <h2 className="mb-2 text-xs font-semibold text-slate-700">
              Aspects (Right)
            </h2>

            {loadingGear && (
              <p className="text-[11px] text-slate-400">Loading gear…</p>
            )}

            {!loadingGear &&
              RIGHT_GEAR_SLOTS.map((slotKey) => {
                const row = gear.find((g) => g.slot_key === slotKey);
                const baseItem = row?.d4_items?.[0];

                const displayName =
                  baseItem?.name_tr ||
                  baseItem?.name_en ||
                  row?.unique_name ||
                  "—";

                return (
                  <div
                    key={slotKey}
                    className="flex items-center gap-3 rounded-lg bg-purple-50/80 px-3 py-2"
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
                      <span className="text-xs font-semibold text-emerald-600">
                        {displayName}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {GEAR_SLOT_LABELS[slotKey]}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* DİĞER TABLAR – şimdilik placeholder */}
      {tab === "skills" && (
        <div className="rounded-2xl bg-white/80 p-4 text-[11px] text-slate-700 shadow-sm ring-1 ring-purple-100">
          Skill tree görseli / planner burada olacak. (Şimdilik placeholder.)
        </div>
      )}
      {tab === "paragon" && (
        <div className="rounded-2xl bg-white/80 p-4 text-[11px] text-slate-700 shadow-sm ring-1 ring-purple-100">
          Paragon board / node düzeni burada olacak. (Placeholder.)
        </div>
      )}
      {tab === "mercs" && (
        <div className="rounded-2xl bg-white/80 p-4 text-[11px] text-slate-700 shadow-sm ring-1 ring-purple-100">
          Mercenary setup burada olacak. (Placeholder.)
        </div>
      )}
      {tab === "notes" && (
        <div className="rounded-2xl bg-white/80 p-4 text-[11px] text-slate-700 shadow-sm ring-1 ring-purple-100">
          Rotation, playstyle notları, boss tips vs. burada markdown/text
          olarak tutulabilir. (Placeholder.)
        </div>
      )}
    </div>
  );
}

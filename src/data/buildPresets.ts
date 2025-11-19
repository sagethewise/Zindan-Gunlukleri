// src/data/buildPresets.ts
import { D4ClassId } from "@/lib/types";

export interface Rune {
  name: string;
  icon: string;
}

export interface SkillIcon {
  name: string;
  icon: string;
}

export interface GearSlotConfig {
  slot: string;        // "Helm", "Chest Armor" vs.
  uniqueName?: string; // D4builds / unique item adı
  localIcon?: string;  // /images/items/... yolu
}

export interface BuildPreset {
  classId: D4ClassId;
  // Kaos perk için istersen varyant kullanabiliriz (şimdilik sadece placeholder)
  chaosVariant?: "barb-default" | "druid-default" | "sorc-default" | string;
  leftSlots: GearSlotConfig[];
  rightSlots: GearSlotConfig[];
  runes: Rune[];
  skills: SkillIcon[];
}

/**
 * Key: build.slug.toLowerCase()
 * DB'de slug'ı nasıl verdiysen burada da aynı / lowerCase karşılığını kullan.
 */
export const BUILD_PRESETS: Record<string, BuildPreset> = {
  // ===========================
  // BARBARIAN – DUAL BASIC
  // ===========================
  "dual basic": {
    classId: "barbarian",
    chaosVariant: "barb-default",
    leftSlots: [
      {
        slot: "Helm",
        uniqueName: "Ramaladni's Magnum Opus",
        localIcon: "/images/items/barbarian/helm_ramaladni.png",
      },
      {
        slot: "Chest Armor",
        uniqueName: "Battle Trance",
        localIcon: "/images/items/barbarian/chest_battle_trance.png",
      },
      {
        slot: "Gloves",
        uniqueName: "Rage of Harrogath",
        localIcon: "/images/items/barbarian/gloves_rage_of_harrogath.png",
      },
      {
        slot: "Pants",
        uniqueName: "Hooves of the Mountain God",
        localIcon: "/images/items/barbarian/pants_hooves.png",
      },
      {
        slot: "Boots",
        uniqueName: "Paingorger's Gauntlets",
        localIcon: "/images/items/barbarian/boots_paingorger.png",
      },
      {
        slot: "Bludgeoning Weapon",
        uniqueName: "Aspect of the Moonrise",
        localIcon: "/images/items/barbarian/bludgeoning_moonrise.png",
      },
      {
        slot: "Dual-Wield Weapon 1",
        uniqueName: "Shard of Verathiel",
        localIcon: "/images/items/barbarian/dw1_shard_of_verathiel.png",
      },
    ],
    rightSlots: [
      {
        slot: "Amulet",
        uniqueName: "Aspect of Adaptability",
        localIcon: "/images/items/barbarian/amulet_adaptability.png",
      },
      {
        slot: "Ring 1",
        uniqueName: "Ring of Starless Skies",
        localIcon: "/images/items/barbarian/ring1_starless_skies.png",
      },
      {
        slot: "Ring 2",
        uniqueName: "Aspect of Earthquakes",
        localIcon: "/images/items/barbarian/ring2_earthquakes.png",
      },
      {
        slot: "Slashing Weapon",
        uniqueName: "The Grandfather",
        localIcon: "/images/items/barbarian/slashing_grandfather.png",
      },
      {
        slot: "Dual-Wield Weapon 2",
        uniqueName: "Sabre of Tsasgal",
        localIcon: "/images/items/barbarian/dw2_sabre_tsasgal.png",
      },
    ],
    runes: [
      { name: "Igni", icon: "/images/runes/igni.png" },
      { name: "Tec", icon: "/images/runes/tec.png" },
      { name: "Moni", icon: "/images/runes/moni.png" },
      { name: "Qax", icon: "/images/runes/qax.png" },
    ],
    skills: [
      {
        name: "Lunging Strike",
        icon: "/images/builds/barbarian/lunging-strike.png",
      },
      {
        name: "Whirlwind",
        icon: "/images/builds/barbarian/whirlwind.png",
      },
      {
        name: "Rallying Cry",
        icon: "/images/builds/barbarian/rallying-cry.png",
      },
      {
        name: "War Cry",
        icon: "/images/builds/barbarian/war-cry.png",
      },
      {
        name: "Challenging Shout",
        icon: "/images/builds/barbarian/challenging-shout.png",
      },
      {
        name: "Wrath of the Berserker",
        icon: "/images/builds/barbarian/wrath-of-the-berserker.png",
      },
    ],
  },

  // ===========================
  // DRUID – PULVERIZE (ENDGAME)
  // ===========================
  pulverize: {
    classId: "druid",
    chaosVariant: "druid-default",
    leftSlots: [
      {
        slot: "Helm",
        uniqueName: "Vasily's Prayer",
        localIcon: "/images/items/druid/helm_vasily.png",
      },
      {
        slot: "Chest Armor",
        uniqueName: "Mad Wolf's Glee",
        localIcon: "/images/items/druid/chest_mad_wolf.png",
      },
      {
        slot: "Gloves",
        uniqueName: "Stormshifter's Aspect",
        localIcon: "/images/items/druid/gloves_stormshifter.png",
      },
      {
        slot: "Pants",
        uniqueName: "Mighty Storm's Aspect",
        localIcon: "/images/items/druid/pants_mighty_storm.png",
      },
      {
        slot: "Boots",
        uniqueName: "Dire Wolf's Aspect",
        localIcon: "/images/items/druid/boots_dire_wolf.png",
      },
      {
        slot: "Bludgeoning Weapon",
        uniqueName: "Shockwave Aspect",
        localIcon: "/images/items/druid/bludgeon_shockwave.png",
      },
      {
        slot: "Dual-Wield Weapon 1",
        uniqueName: "Overcharged Aspect",
        localIcon: "/images/items/druid/dw1_overcharged.png",
      },
    ],
    rightSlots: [
      {
        slot: "Amulet",
        uniqueName: "Natural Disaster Aspect",
        localIcon: "/images/items/druid/amulet_natural_disaster.png",
      },
      {
        slot: "Ring 1",
        uniqueName: "Ring of the Ursine Horror",
        localIcon: "/images/items/druid/ring1_ursine_horror.png",
      },
      {
        slot: "Ring 2",
        uniqueName: "Aspect of the Rampaging Werebeast",
        localIcon: "/images/items/druid/ring2_rampaging_werebeast.png",
      },
      {
        slot: "Slashing Weapon",
        uniqueName: "Earthstriker's Aspect",
        localIcon: "/images/items/druid/slashing_earthstriker.png",
      },
      {
        slot: "Dual-Wield Weapon 2",
        uniqueName: "Aspect of Retaliation",
        localIcon: "/images/items/druid/dw2_retaliation.png",
      },
    ],
    runes: [
      { name: "Igni", icon: "/images/runes/igni.png" },
      { name: "Moni", icon: "/images/runes/moni.png" },
      { name: "Cir", icon: "/images/runes/cir.png" },
      { name: "Gar", icon: "/images/runes/gar.png" },
    ],
    skills: [
      { name: "Storm Strike", icon: "/images/builds/druid/storm-strike.png" },
      { name: "Pulverize", icon: "/images/builds/druid/pulverize.png" },
      { name: "Blood Howl", icon: "/images/builds/druid/blood-howl.png" },
      { name: "Debilitating Roar", icon: "/images/builds/druid/debilitating-roar.png" },
      { name: "Trample", icon: "/images/builds/druid/trample.png" },
      { name: "Grizzly Rage", icon: "/images/builds/druid/grizzly-rage.png" }
    ],
  },

  // ===========================
  // SORCERER – HYDRA (ENDGAME)
  // ===========================
  hydra: {
    classId: "sorcerer",
    chaosVariant: "sorc-default",
    leftSlots: [
      {
        slot: "Helm",
        uniqueName: "Tal Rasha's Iridescent Loop",
        localIcon: "/images/items/sorcerer/helm_tal_rasha.png",
      },
      {
        slot: "Chest Armor",
        uniqueName: "Raiment of the Infinite",
        localIcon: "/images/items/sorcerer/chest_raiment.png",
      },
      {
        slot: "Gloves",
        uniqueName: "Gloves of the Illuminator",
        localIcon: "/images/items/sorcerer/gloves_illuminator.png",
      },
      {
        slot: "Pants",
        uniqueName: "Snowveiled Aspect",
        localIcon: "/images/items/sorcerer/pants_snowveiled.png",
      },
      {
        slot: "Boots",
        uniqueName: "Esu's Heirloom",
        localIcon: "/images/items/sorcerer/boots_esu.png",
      },
      {
        slot: "Bludgeoning Weapon",
        uniqueName: "Flamescar",
        localIcon: "/images/items/sorcerer/staff_flamescar.png",
      },
      {
        slot: "Dual-Wield Weapon 1",
        uniqueName: "The Oculus",
        localIcon: "/images/items/sorcerer/dw1_oculus.png",
      }
    ],
    rightSlots: [
      {
        slot: "Amulet",
        uniqueName: "Aspect of Control",
        localIcon: "/images/items/sorcerer/amulet_control.png",
      },
      {
        slot: "Ring 1",
        uniqueName: "Tal Rasha's Iridescent Loop",
        localIcon: "/images/items/sorcerer/ring1_tal_rasha.png",
      },
      {
        slot: "Ring 2",
        uniqueName: "Ring of Starless Skies",
        localIcon: "/images/items/sorcerer/ring2_starless_skies.png",
      },
      {
        slot: "Slashing Weapon",
        uniqueName: "Weapon of choice",
        localIcon: "/images/items/sorcerer/slashing_placeholder.png",
      },
      {
        slot: "Dual-Wield Weapon 2",
        uniqueName: "Off-hand Focus",
        localIcon: "/images/items/sorcerer/dw2_focus.png",
      }
    ],
    runes: [
      { name: "Igni", icon: "/images/runes/igni.png" },
      { name: "Tec", icon: "/images/runes/tec.png" },
      { name: "Moni", icon: "/images/runes/moni.png" },
      { name: "Gar", icon: "/images/runes/gar.png" }
    ],
    skills: [
      { name: "Fire Bolt", icon: "/images/builds/sorcerer/fire-bolt.png" },
      { name: "Hydra", icon: "/images/builds/sorcerer/hydra.png" },
      { name: "Firewall", icon: "/images/builds/sorcerer/firewall.png" },
      { name: "Teleport", icon: "/images/builds/sorcerer/teleport.png" },
      { name: "Flame Shield", icon: "/images/builds/sorcerer/flame-shield.png" },
      { name: "Inferno", icon: "/images/builds/sorcerer/inferno.png" }
    ],
  },

  // Diğer build’ler için burayı aynı pattern’de doldurabilirsin…
};

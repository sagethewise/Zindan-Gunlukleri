// src/lib/normalizers/normalizeD4.ts
import type {
  D4BuildDetailNormalized,
  D4ItemSlot,
  D4ItemView,
  D4SkillView,
} from "@/lib/types/buildDetailTypes";

// Eğer buildDetailTypes henüz yoksa, ben sana onu da oluştururum.

export function normalizeD4buildsJson(raw: any): D4BuildDetailNormalized {
  // RAW JSON boşsa fallback
  if (!raw || typeof raw !== "object") {
    return {
      core: {
        name: "Unknown Build",
        class: "unknown",
        season: 0,
      },
      skills: {
        main: [],
      },
      gear: {},
      paragon: {},
      notes: [],
    };
  }

  return {
    core: {
      name: raw.name,
      class: raw.class,
      season: raw.season,
      pit: raw.pit,
      tier: raw.tier,
      content: raw.content,
      creator: raw.cc,
    },

    skills: {
      main: (raw.skills ?? []).map((s: any) => ({
        name: s.name,
      })),
    },

    // Şu an build JSON’un item/aspect bilgisi içermediği için boş bırakıyoruz.
    // d4builds full endpoint gelince burayı dolduracağız.
    gear: {},

    paragon: {
      boards: raw.paragonBoards ?? [],
      glyphs: raw.glyphs ?? [],
    },

    notes: [],
  };
}

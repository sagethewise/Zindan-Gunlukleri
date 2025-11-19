// src/lib/types/buildDetailTypes.ts

export type D4ItemSlot =
  | "helm"
  | "chest"
  | "gloves"
  | "pants"
  | "boots"
  | "amulet"
  | "ring1"
  | "ring2"
  | "weapon1"
  | "weapon2"
  | "offhand";

export interface D4ItemView {
  slot: D4ItemSlot;
  name: string;
  aspectName?: string;
  iconUrl?: string;
  affixes?: string[];
  gems?: string[];
}

export interface D4SkillView {
  name: string;
  type?: string;
}

export interface D4BuildDetailNormalized {
  core: {
    name: string;
    class: string;
    season: number;
    pit?: number | null;
    tier?: number | null;
    content?: string;
    creator?: string;
  };

  skills: {
    main: D4SkillView[];
    passives?: D4SkillView[];
    keyPassive?: D4SkillView | null;
  };

  gear: Record<string, D4ItemView | undefined>;

  paragon: {
    boards?: string[];
    glyphs?: string[];
  };

  notes: string[];
}

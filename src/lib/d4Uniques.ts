import uniquesJson from "@/../public/data/d4builds-unique-items.json";

export type D4UniqueItem = {
  id: string;
  name: string;
  slot: string | null;              // "Boots", "Helm" vs.
  class: string | null;             // "Barbarian" vs.
  secondaryStats: string[];         // secondary_stats
  tertiaryStats: string[];          // terciary_stats
  tertiaryStatsFull: string[];      // terciary_stats__full
  effect: string | null;
  flavor: string | null;
  icon: string;                     // şimdilik çoğu ""
  source: string;                   // "d4builds-uniques"
};

export const D4_UNIQUES = uniquesJson as D4UniqueItem[];

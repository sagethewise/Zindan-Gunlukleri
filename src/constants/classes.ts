export type ClassKey =
  | "barbarian"
  | "druid"
  | "necromancer"
  | "rogue"
  | "sorcerer"
  | "spiritborn"
  | "unknown";

export const CLASS_KEYS: ClassKey[] = [
  "barbarian",
  "druid",
  "necromancer",
  "rogue",
  "sorcerer",
  "spiritborn",
];

// EKRANDA GÖRÜNEN AD (sen İngilizce kalsın demiştin)
export const CLASS_LABEL: Record<ClassKey, string> = {
  barbarian: "Barbarian",
  druid: "Druid",
  necromancer: "Necromancer",
  rogue: "Rogue",
  sorcerer: "Sorcerer",
  spiritborn: "Spiritborn",
  unknown: "Unknown",
};

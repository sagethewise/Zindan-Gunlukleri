// src/types/d4BuildDetail.ts
export type D4BuildDetail = {
  id: string;
  slug: string;
  name: string;
  class_key: string;       // "barbarian", "druid", ...
  season: string | null;
  pit: number | null;

  // skills alanı: skill key listesi
  skills: string[];        // ["lunging-strike-barbarian", "war-cry-barbarian", ...]
  // ... diğer gear/aspect/paragon alanların
};

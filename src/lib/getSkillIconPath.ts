// src/lib/getSkillIconPath.ts
import type { D4Skill } from "@/lib/types/d4Skills";

export function getSkillIconPath(skill: D4Skill): string {
  const classFolder = skill.class_key.toLowerCase(); // barbarian, spiritborn...
  const iconBase =
    skill.icon_key ??
    skill.key
      .replace(`${classFolder}-`, "")    // booming-voice-barbarian -> booming-voice
      .replace(/-spiritborn$/, "")       // rake-spiritborn -> rake
      .replace(/-/g, "_");               // booming-voice -> booming_voice

  return `/images/builds/${classFolder}/${iconBase}.png`;
}

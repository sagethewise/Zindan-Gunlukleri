// Project target, not an assertion that the season has already gone live.
export const TARGET_D4_SEASON = 16;
export const LEGACY_D4_SEASON = 10;
export const KNOWN_D4_SEASONS = [TARGET_D4_SEASON, LEGACY_D4_SEASON] as const;
export const D4_SEASON_16 = {
 number:16,patch:"3.3.0",scheduledStart:"2026-12-01T17:30:00Z",
 announcement:"https://news.blizzard.com/en-us/article/24316979/advance-the-war-against-death-in-season-of-tyraels-gambit",
 patchNotes:"https://news.blizzard.com/en-us/article/24316980/diablo-iv-patch-notes",
} as const;
export const isKnownSeason=(season:number)=>KNOWN_D4_SEASONS.some(s=>s===season);
export function season16Status(now=Date.now()){return now<Date.parse(D4_SEASON_16.scheduledStart)?"upcoming":"check-live";}

# Season 15 candidate reconciliation
Migration 008 creates a private candidate queue targeted at S15 patch 3.2.4, preserving legacy references without copying raw descriptions or stats. Each unique variant is kept individually, skill keys deduplicated by class, gear references keyed by item name instead of slot. Pending candidates are not current data. Four limited identity observations (Pulverize, Incinerate, Tal, Sol) are corroborated by the official S15 3.2.2 notes; this is not evidence of final 3.2.4 stats or rank limits.
Source: https://news.blizzard.com/en-us/article/24295395/diablo-iv-patch-notes-3-2

## Database categories inspected on D4Builds
- Uniques: https://d4builds.gg/database/uniques/
- Gear affixes: https://d4builds.gg/database/gear-affixes/
- Horadric affixes: https://d4builds.gg/database/horadric-affixes/
- Class skills: https://d4builds.gg/database/class-skills/
- Prime Evil powers: https://d4builds.gg/database/prime-evil-powers/
- Paragon boards: https://d4builds.gg/database/paragon-boards/
- Paragon glyphs: https://d4builds.gg/database/paragon-glyphs/
- Tempering: https://d4builds.gg/database/tempering-manuals/
- Runeword recipes: https://d4builds.gg/database/rune-word-recipes/
The general database route could not be retrieved; this is a verified category list, not a claim of complete menu coverage. Some page results are explicitly PTR. Do not infer Season 15 from a page title alone. No bulk records retrieved. Other categories (runes, aspects, gems, materials, loot, class systems) are tracked in the existing 34-kind schema.

Legacy mismatch observed: gear slots reference Ramaladni's Magnum Opus as helm and Rage of Harrogath as gloves; the old unique table lists both as Boots. Neither is a reliable current-season item slot. Reconcile against verified S15 source or first-party in-game observations before assigning type, stats or builds.

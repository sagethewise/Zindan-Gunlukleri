# BF-04A — Equipment details and selection

Priority change: pause interactive Skill Tree / Paragon development until equipment details and selection work.

## Existing archive (preview only)

The existing checked-in Season 10 era D4Builds page-data archive is projected into a narrow read-only item/stat response. No external source is fetched, no new third-party content is ingested, and the approved public catalog remains empty. The API refuses production. Source and English-language legacy status are shown in the inspector. Rights, exact patch and current accuracy are unverified; do not enable production until source review. No new icons are downloaded; existing exact-name local images are used where available, otherwise generic category icons. Data includes archived stat ranges, item effects and matching loot table boss names where actually present. The app does not infer missing values or weapon hand restrictions, aspect-slot validity, socket counts or current-season rules.

- 566 archived unique/variant entries plus 385 aspect entries.
- 474 slot/class stat associations (289 distinct stat names).
- Item type and explicit class restrictions filter candidates; aspects with unknown slot eligibility are labeled unverified.
- Slot/class stat names are selectable without inventing numeric ranges; item-specific archived ranges display in the item inspector.

## Build detail

The previous gear load always set an empty array. Read existing build_gear_slots by exact build ID (resolve the existing detail ID using matching external UUID and season when available). Do not invent assignments. Each slot opens an accessible equipment inspector; names are rendered from recorded unique/aspect names. If no actual assignments are available, the archive may still be browsed without associating an item with that build.

## Planner

The same inspector provides searchable item/aspect choices and stat lists in a two-pane layout. Selection updates the user's local draft; IDs and stat names survive save/export/import. Manual edits remain available. These are draft selections, not validated game builds. Language UI is TR/EN/DE; archive content remains English until translations and reuse are reviewed.

No database migrations or source permission updates in this phase. Future work: authorized catalog export with slot relations, current patch game data, complete build-to-gear assignments, licensed icons, reviewed localizations, and precise affix rolls.

# BF-02: Source research and data model — 27 November 2026

## What we could verify
- D4Builds describes its builds as hand-crafted, with creator-specific pages (e.g. Rob2628). This explains build authorship, not the origin or license of the game catalog. Privacy policy describes user data, not game-data reuse rights.
- Mobalytics lists expert/creator builds and attributed creator submissions. Exact catalog provenance not verified. Its terms must be reviewed before any integration.
- Maxroll direct pages were blocked to research access; no public catalog source or reuse grant verified. Do not infer that it uses Blizzard's API.
- D4 Forge (d4-forge.com, distinct from d4builds.gg) explicitly says it derives catalog data from game client extraction and official announcements. Its terms prohibit bulk automated collection. Its claim of fair use is not a transferable license.
- D4Gamers documents dated, hashed source snapshots and separates original editorial work, game extraction, and community data. Good provenance design reference, not permission to copy.
- DiabloTools/d4data and Diablo4Companion are community projects. Open-source code licensing does not automatically cover Blizzard game assets, text or third-party databases.
- Public Diablo IV Battle.net game data API not verified. Blizzard API terms include data-mining and monetization restrictions; written permissions should explicitly cover intended ad-supported use, translation and attribution.

## Decision
Use one private, versioned PostgreSQL schema in the existing Supabase project. Separate game entities from creator/editorial builds. No external scraping, undocumented API use, or copied guide/asset collection; no new game-data imports until permission scope is documented.

## Database mapping
- Equipment: equipment_slot, item_type, item, aspect, affix, temper_manual, gem, material, craft_recipe
- Skills: skill, skill_upgrade, skill_passive, skill_tree, skill_node
- Paragon: paragon_board, paragon_node, glyph
- Other systems: rune, runeword, mercenary, mercenary_skill, seal, charm, talisman, war_plan, war_plan_node, class_mechanic, season_mechanic
- Reference data: class, activity, boss, loot_source, stat, formula
- Graph: entity_relations stores typed links and edge attributes (e.g. prerequisites, positions, slots, drops). Same patch enforced by composite foreign keys.
- TR/EN/DE name and description per entity version; translations reviewed independently.
- Meta: creator, build, versioned revision, localized editorial texts, variants, selections referencing catalog, ranking methodology and evidence.
- Publication: private roles by default; approved sources, approved snapshots, approved entity records required. Revocation removes entries from publishable views. Public application access and locale review filters are future separate reviewed work; no public API is exposed now.

## Source negotiation checklist
Ask providers for documented API/data feed, covered fields, release and review cadence, permitted storage, caching, public redistribution, translations, commercial/ad-supported usage, attribution, rate limits, asset rights, takedown and deletion rules. A link-only reference and original creator-submitted build are useful alternatives if redistribution is unavailable.

## Draft outreach (not sent)
Subject: Diablo IV game data / build catalogue licensing inquiry — Dungeon Diaries

Hello,

We are developing Dungeon Diaries, an independent multilingual Diablo IV companion website (Turkish, English and German). We are seeking a documented, authorized way to access game reference data and/or creator build metadata rather than scraping your website.

Do you offer a public or partner API, licensed data feed, or written permission covering equipment, affixes, skills, Paragon, runes, seasonal systems and build metadata? If available, please clarify permitted caching, redistribution, translations, attribution, commercial/ad-supported use, update cadence and applicable asset restrictions. We can also support link-only references or creator-authorized submissions if full redistribution is not permitted.

Thank you for your guidance.

Dungeon Diaries — https://zindangunlukleri.com

## References
- https://d4builds.gg/rob2628/builds/
- https://d4builds.gg/privacy/
- https://mobalytics.gg/diablo-4/creator-builds
- https://mobalytics.gg/terms/
- https://d4-forge.com/about
- https://d4-forge.com/terms
- https://www.d4gamers.com/research/
- https://github.com/DiabloTools/d4data
- https://github.com/blizzhackers/d4data/blob/master/readme.md
- https://github.com/josdemmers/Diablo4Companion
- https://www.blizzard.com/en-us/legal/a2989b50-5f16-43b1-abec-2ae17cc09dd6/blizzard-developer-api-terms-of-use
- https://community.developer.battle.net/documentation

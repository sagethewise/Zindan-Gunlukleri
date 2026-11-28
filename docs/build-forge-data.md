# Build Forge data strategy — 2026-11-27

## Provenance
- Public Battle.net developer portal: https://community.developer.battle.net/documentation
- Public Diablo IV API discussion (not an official confirmation): https://us.forums.blizzard.com/en/blizzard/t/still-no-diablo-iv-api/59236
- Blizzard developer terms: https://www.blizzard.com/en-gb/legal/a2989b50-5f16-43b1-abec-2ae17cc09dd6/blizzard-developer-api-terms-of-use
- Official patch/context: https://news.blizzard.com/en-us/article/24302578/the-3-3-0-ptr-what-you-need-to-know
- D4Builds feature reference: https://d4builds.gg/build-planner/

No documented public Diablo IV game-data or character API was verified. Existing fetch scripts historically used D4Builds page data, not a documented Blizzard API. Do not run these scripts for new ingestion without explicit source permission. Open-source parser licenses do not automatically license Blizzard assets or data. The new planner is independently implemented and stores only user-authored drafts locally.

## Read-only Supabase audit
Counts visible to configured anonymous client; RLS may limit visibility.
- d4_homepage_builds: 19, all season 10
- d4_build_details: 45, all season 10; skills present in 45, runes/paragon/mercenaries empty in 45.
- d4_skills: 0 visible
- d4_items: 0 visible
- d4_uniques: 160
- d4_legendary_aspects: 385
- d4_paragon_boards: 61
- d4_paragon_glyphs: 107
- d4_runes: 44
- d4_tempering_manuals: 157
- build_gear_slots: 12
- build_runes: HTTP 404

Counts do not establish accuracy, usage permission, or current-patch coverage. Existing season 10 views remain historical.

## Next data milestones
1. Obtain an authorized documented dataset or written permission. Record provider, exact game version, locale, license, retrieval and review dates; no new automated imports before this.
2. Define versioned item/skill/aspect/glyph/board/rune catalogs with explicit provenance and locale fallback. Keep historical versions immutable.
3. Add relational gear eligibility, skill prerequisites, point budgets, skill tree edges, Paragon board connections, sockets and season/expansion constraints. Do not invent rules from incomplete data.
4. Validate imported catalogs against official patch notes and sampled in-game values. Only reviewed data becomes selectable; unknown values stay blank.
5. Add account-free share links or authenticated saved builds after persistence design and privacy review. Damage simulation and tier ranking require verified formulas and test fixtures.

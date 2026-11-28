# BF-04C — Provider decision (27 November 2026)

## Verified findings
- InfinityBuilds is creator/community built; InfinityTools publishes a separate game data catalog identified as 3.2.4 build 74043 with Live and S16 PTR views. Its tools page describes underlying data as taken from the game, and its terms state that Infinity Team extracts and maintains the database. No documented reusable public API located. The terms permit supplied branded embeds and links, and require prior written permission for automated access, large-scale database reuse, and substantial build republication. Contact the team's Discord linked in footer.
- Mobalytics S15 tier list is curated by named creators with evaluation criteria including power, speed, survivability, and investment/difficulty. This is editorial ranking, not official game data. Underlying raw item data acquisition/API not verified. Terms grant limited personal non-commercial use; do not assume redistribution permission.
- D4Builds S16 list is visible, but public API and redistribution rights remain unverified.
- Community extraction projects may document independently authored parsing tools; an open-source parser license does not cover Blizzard's game assets or database rights. Require explicit dataset/asset permission.

## Decision: catalog first, build ranking second
1. Source registry records rights scope (storage, public display, translation, commercial use, assets, attribution, revocation); request partner feeds and written approval from Infinity and Mobalytics/creators. No scraping or undocumented endpoints.
2. Register patch/channel separately: S15 live 3.2.4 build 74043; S16 3.3.0 PTR; verify actual 1 December launch before registering S16 live. Keep previous season immutable. Existing S10 data is not promoted to S15.
3. Normalize authorized catalogue first: class, item types, item + affixes and ranges, aspects, gems, runes, skill, Paragon, crafting and seasonal systems. Use stable entity IDs, patch version IDs, source snapshot hashes, locale review and graph relations. The existing private schema and transactional stage_catalog handle this.
4. Build revisions reference the same catalog entity versions via variants, selections, and source metadata. Reject cross-patch references. Use creator-authorized build submissions or original builds, and separately sourced editorial assessments; do not treat competitor tiers as our own rankings.
5. Export reviewed, rights-authorized data to public catalog and build views; connect picker and item details. Implement revocation-aware publication before deploying real imported records.

Public UI exposes S15/16 links only. Legacy S10 catalog and raw file routes withdrawn; existing repo data and database rows remain intact. Private local user drafts are retained, including historical notes. Approved public data is not available yet. No production merge or database execution.

## Source references
- https://infinitybuilds.gg/en
- https://tools.infinitybuilds.gg/en/database
- https://tools.infinitybuilds.gg/en
- https://infinitybuilds.gg/en/terms
- https://infinitybuilds.gg/en/privacy
- https://mobalytics.gg/diablo-4/tier-list
- https://mobalytics.gg/terms/
- https://news.blizzard.com/en-us/article/24295395/diablo-iv-patch-notes
- https://news.blizzard.com/en-us/article/24316979/advance-the-war-against-death-in-season-of-tyraels-gambit

## Partner inquiry (draft; not sent)
Hello Infinity Team,
We are developing Dungeon Diaries (zindangunlukleri.com), a Turkish, English and German Diablo IV companion. We noticed InfinityTools maintains patch-specific item and affix data and a separate PTR catalog. Do you offer a documented partner API, downloadable licensed snapshot, or data partnership for game reference data? We would like to clarify permitted storage, display, translation, ad-supported usage, game asset rights, rate limits, attribution, update cadence and revocation. If redistribution is unavailable, we will link to your tools or use your supplied unmodified branded embeds where permitted. We would also welcome creator-authorized build submissions. Thank you.

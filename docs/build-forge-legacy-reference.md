# Historical reference reconciliation
The user's old database contains existing skill translation rows, temporary per-class skills, unique/variant records, aspects, Paragon boards, glyphs, runes, temper manuals and gear-slot assignments. Migration 007 exposes read-only private reference views over these existing rows, without copying descriptions or values or altering old tables. It is not a current-season data import.

Queries:
```sql
select * from build_forge.legacy_skill_inventory order by class_key;
select * from build_forge.legacy_reference_coverage order by kind;
select * from build_forge.legacy_reference_index where kind='gear_item_reference';
```
Candidate keys are not necessarily distinct skills, and old skill records are unclassified (not assumed active/passive). Gear assignments are reference observations, not verified item/affix definitions. No historic record is assigned to season 15/16 or approved for public publishing. Reconcile stable keys, then verify the current patch, rank, affix values, eligibility and rights before staging versioned entities. No new third-party data fetched.

D4Builds reference pages reviewed: https://d4builds.gg/database/horadric-affixes/ ; https://d4builds.gg/database/prime-evil-powers/ ; https://d4builds.gg/database/class-skills/ . Their visible database does not prove a documented public API, upstream source or reuse permission. An independently maintained game-data extraction pipeline is plausible (other projects disclose this), not verified for D4Builds.

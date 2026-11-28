# DB-01 / DB-02 — Class reference and coverage
The private class_directory seed contains the eight official class names verified at https://diablo4.blizzard.com/en-us/ on 2026-11-27. It is a reference directory, not patch-specific game data. No skill descriptions, rank limits or items have been inferred. The remaining entity kinds are represented by the existing versioned schema.

After applying migrations 001–006 to the intended Supabase project, an authorized database administrator can inspect:
```sql
select * from build_forge.class_directory order by class_key;
select * from build_forge.class_skill_coverage order by season,class_key,kind;
select * from build_forge.catalog_coverage order by season,kind;
```
Coverage includes zero-count categories and distinguishes stored from publishable rows and complete reviewed tr/en/de texts. Counts do not prove completeness; compare against a verified source manifest. The skill report counts explicit class assignments; unknown/unassigned skills are not silently counted toward a class.

These are private views, not public API endpoints. All migrations tested in a local PostgreSQL-compatible PGlite instance. No production deployment or data imports were executed. Connect the correct Supabase project for live migration review and execution; do not send service role keys in chat.

# BF-03 — Authorized catalog staging

This is an additive private migration, not a live database deployment. It does not fetch sites, approve sources, publish data or modify existing legacy tables. All currently registered external sources remain pending.

## Workflow

1. Obtain documented storage rights for the exact dataset. Where needed, verify translation, redistribution and monetization separately. An administrator records the evidence and approves the source; an allowed storage flag alone does not grant publication.
2. Register a verified game version in build_forge.game_versions, distinguishing live, PTR and historical builds.
3. Normalize the authorized file into the bundle format below. Do not guess missing values, copy artwork, or invent game rules. The same format covers all entity kinds in the catalog enum.
4. Inspect the bundle locally. The report lists entity types, locale coverage, relationships and a digest of the normalized JSON. Coverage is a count, not a claim of completeness.
5. Generate SQL to a private file; review it before execution against an authorized staging database. Database permission settings are checked again on execution.
6. Review the pending snapshot and each entity and translation. No publication is automatic. The DB stores its own canonical JSONB SHA-256 (not necessarily identical to the local JSON digest).

```sh
node scripts/forge/catalog.mjs inspect bundle.json
node scripts/forge/catalog.mjs sql bundle.json > stage-catalog.sql
```

The importer inserts all records in one transaction, rejects unknown patch/source, conflicting entity versions, duplicate imports and dangling links, and never overwrites historical data. Relationships in a bundle must refer to entities in that bundle. Existing entity versions cannot be silently replaced; corrections need a separate reviewed design. The function is not accessible to anonymous or authenticated application roles. Translation variants are left in draft, regardless of source's allowed translation flag.

## Synthetic example (not real Diablo data)

```json
{
  "schemaVersion": 1,
  "sourceKey": "dungeon-diaries",
  "sourceUrl": "https://example.org/fixture",
  "patch": "fixture",
  "channel": "historical",
  "originalLocale": "en",
  "entities": [
    {
      "kind": "skill",
      "stableKey": "fixture-skill",
      "attributes": {},
      "texts": {"en": {"name": "Synthetic fixture"}}
    }
  ],
  "relations": []
}
```

## Validation boundaries

The local inspector validates structure, not truth or license. The database requires approved storage permission and verifies relational integrity; semantic checks (game formula accuracy, class restrictions, graph balance, translation correctness) remain editorial tasks. No credentials, actual datasets or generated SQL should be committed. The public planner still accepts user-authored drafts; no public catalog API has been opened.

## Tests

Use Node 24 and an installed @electric-sql/pglite module with the PGLITE_MODULE environment variable pointing to its entrypoint. Run `node --test tests/*.test.mjs`. All data used is synthetic. Tests exercise transactional rollback, permission gates, missing versions, translation restrictions, duplicates and role access.

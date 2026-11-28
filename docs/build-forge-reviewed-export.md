# BF-04D — Reviewed catalog and build graph export

Migration 202611270005 is a private, read-only candidate exporter, not a live deployment. It requires the preceding private schema and source/season migrations. It does not fetch, grant, import, publish, or change any external records.

Run as an authorized database administrator against a reviewed staging database:
```sql
select build_forge.export_reviewed_catalog(15,'3.2.4','live');
select build_forge.export_reviewed_build_graph(15,'3.2.4','live');
select build_forge.export_reviewed_catalog(16,'3.3.0','ptr');
```

Only exact version/season/channel, approved source, snapshot and entity records with commercial publication rights enter the candidate catalog. Original texts and reviewed permitted translations only. Build exports require approved build texts, at least one exact catalog selection, and all selected entities eligible for export. Build text schema lacks an original-language field, so the multilingual build graph requires translation rights conservatively. Graph edges have both endpoints in the same exported catalog. An affix edge can carry strictly typed min/max and units when provided; no arbitrary fields are projected. Homepage attribution is exposed; private permission evidence, raw source snapshot URLs, raw arbitrary attributes and settings are not exported. Revoked permissions or review state remove subsequent exports and dependent builds.

Candidate exports are not automatically written into public files. The catalog is compatible with the basic explorer's entry shape; its relationship graph and build graph are not yet the finalized planner/build reader schema. Review relationship accuracy, allowed numerical fields and slot eligibility before adding those to the public projection; implement publication and takedown workflows before actual data is deployed. Static files already deployed do not revoke themselves, so a corrected export plus redeployment is required. No direct public access to Supabase is introduced.

## First-party pilot proposal — not a playable or tested build

Start with a Druid companion-focused concept, rather than copying a creator's meta build. Blizzard's scheduled 3.3.0 notes identify a change to the Raven-related Horadric affix in Nafain's Bestiary (passive attack speed), so this is a specific mechanic to validate after the live release. This is a research lead, not a currently verified item or gameplay result. Source: https://news.blizzard.com/en-us/article/24316980/diablo-iv-patch-notes

Collect first-party observations from the player's own game:
- Season, patch/build number, realm, class, difficulty.
- Equipment slot, item name/type, affix text and exact displayed range/current roll, optional Aspect, socket contents, where obtained if personally verified.
- Active skills and rank, build variant, intended playstyle, measured activity/test conditions and result.
- Original screenshots for private verification; confirm rights before publishing images or game descriptions.
- Localized names and source notes; unknown fields remain empty. No external build guide is copied.

Record these in a private normalized bundle using docs/build-forge-import.md. Confirm storage/display permissions for the actual data and creator consent for contributed build content independently, then stage, review, export, and integrate. Do not register the scheduled S16 patch as live until the game launch is verified. No actual pilot gameplay data has been supplied yet.

## Source check

InfinityBuilds terms require written permission for automated collection and substantial database/build reuse. Mobalytics' service license is personal/non-commercial. Neither site, nor D4Builds, exposed a documented reusable Diablo IV catalog API in the reviewed public materials. No scraping or undocumented endpoints were invoked. The partner inquiry in docs/build-forge-provider-decision.md remains unsent.

-- Candidate source registry only. No permission is inferred and no game data is imported.
begin;
insert into build_forge.sources(source_key,name,homepage_url,source_kind,terms_url,notes) values
 ('blizzard','Blizzard Entertainment','https://community.developer.battle.net/documentation','official','https://www.blizzard.com/en-us/legal/a2989b50-5f16-43b1-abec-2ae17cc09dd6/blizzard-developer-api-terms-of-use','Official announcements available; public Diablo IV game-data API not verified. Request express permission for storage, translations, public distribution, monetization, and asset use.'),
 ('d4builds','D4Builds.gg','https://d4builds.gg/','creator','https://d4builds.gg/privacy/','Hand-crafted builds and verified creator pages; privacy policy is not data licensing permission.'),
 ('maxroll','Maxroll','https://maxroll.gg/d4/','creator',null,'Public source provenance and reuse permission not verified. Contact publisher.'),
 ('mobalytics','Mobalytics','https://mobalytics.gg/diablo-4','creator','https://mobalytics.gg/terms/','Expert/creator build publishing; no verified permission for automated catalog or build reuse.'),
 ('diablotools','DiabloTools/d4data','https://github.com/DiabloTools/d4data','community',null,'Community game extraction; parser licensing is separate from rights to game data and assets.'),
 ('diablo4companion','Diablo4Companion','https://github.com/josdemmers/Diablo4Companion','community',null,'MIT application code; underlying game-derived assets/data require independent review.'),
 ('d4gamers','D4Gamers','https://www.d4gamers.com/research/','community',null,'Public provenance and snapshot documentation; no verified redistribution grant.'),
 ('d4-forge','D4 Forge (independent Korean site)','https://d4-forge.com/about','community','https://d4-forge.com/terms','Different from D4Builds.gg. Discloses client extraction and official announcements; terms prohibit bulk automated collection.'),
 ('legacy-d4builds','Legacy Season 10 imports','https://d4builds.gg/','legacy',null,'Historical records already in public schema; no new ingestion or migration to publishable catalog before permission review.'),
 ('dungeon-diaries','Dungeon Diaries original editorial content','https://zindangunlukleri.com/','first_party',null,'Original builds and tests; record authorship, rights scope and review before publication.')
on conflict(source_key) do nothing;
commit;

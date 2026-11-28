-- Source review and verified version metadata only. No external catalog records or permissions.
begin;
insert into build_forge.sources(source_key,name,homepage_url,source_kind,terms_url,notes) values
 ('infinitybuilds','InfinityBuilds / InfinityTools','https://tools.infinitybuilds.gg/en/database','community','https://infinitybuilds.gg/en/terms','Maintained game-data extraction; Live 3.2.4 build 74043 and separate S16 PTR. Terms allow links and supplied branded embeds, require written permission for automated collection, substantial database reuse or build republication. Contact Infinity Team via footer Discord. No license inferred.')
on conflict(source_key) do nothing;
update build_forge.sources set notes='Expert-curated builds and tier ratings; raw item/class data provenance and documented reusable Diablo IV API not verified. Personal non-commercial service license; obtain separate written permission for data/build reuse.'
where source_key='mobalytics' and permission_state='pending';
insert into build_forge.game_versions(patch,season,channel,official_notes_url) values
 ('3.2.4',15,'live','https://news.blizzard.com/en-us/article/24295395/diablo-iv-patch-notes'),
 ('3.3.0',16,'ptr','https://news.blizzard.com/en-us/article/24302578/the-3-3-0-ptr-what-you-need-to-know')
on conflict(patch,channel) do nothing;
-- Do not register S16 as live before confirming actual launch.
commit;

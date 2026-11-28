-- BF-02: additive, isolated schema. No existing public tables are changed.
-- No public API exposure; publishing must be implemented as a separate reviewed step.
begin;
create schema if not exists build_forge;
revoke all on schema build_forge from public, anon, authenticated;
create type build_forge.review_state as enum ('pending','approved','rejected','revoked');
create type build_forge.entity_kind as enum (
 'class','equipment_slot','item_type','item','aspect','affix','temper_manual','gem','material',
 'skill','skill_upgrade','skill_passive','skill_tree','skill_node',
 'paragon_board','paragon_node','glyph','rune','runeword','mercenary','mercenary_skill',
 'seal','charm','talisman','war_plan','war_plan_node','class_mechanic','season_mechanic',
 'activity','boss','loot_source','craft_recipe','stat','formula');
create type build_forge.build_state as enum ('draft','review','published','archived');

create table build_forge.sources (
 id uuid primary key default gen_random_uuid(),
 source_key text not null unique check (source_key ~ '^[a-z0-9_-]+$'),
 name text not null,
 homepage_url text,
 source_kind text not null check (source_kind in ('official','licensed_partner','creator','first_party','community','legacy')),
 terms_url text,
 permission_state build_forge.review_state not null default 'pending',
 permission_evidence text,
 may_store boolean not null default false,
 may_publish boolean not null default false,
 may_monetize boolean not null default false,
 may_translate boolean not null default false,
 reviewed_at timestamptz,
 notes text,
 check (permission_state <> 'approved' or (permission_evidence is not null and reviewed_at is not null and may_store)),
 check (not may_publish or may_store),
 check (not may_monetize or may_publish),
 check (not may_translate or may_store)
);
create table build_forge.game_versions (
 id uuid primary key default gen_random_uuid(),
 patch text not null,
 season integer check (season is null or season > 0),
 channel text not null check (channel in ('live','ptr','historical')),
 expansion text,
 released_at timestamptz,
 official_notes_url text,
 unique (patch,channel)
);
create table build_forge.snapshots (
 id uuid primary key default gen_random_uuid(),
 source_id uuid not null references build_forge.sources(id),
 version_id uuid not null references build_forge.game_versions(id),
 original_url text,
 retrieved_at timestamptz not null default now(),
 sha256 text not null check (sha256 ~ '^[0-9a-f]{64}$'),
 review_state build_forge.review_state not null default 'pending',
 reviewed_at timestamptz,
 review_notes text,
 unique (id,version_id),
 unique (source_id,version_id,sha256),
 check (review_state <> 'approved' or reviewed_at is not null)
);
create table build_forge.entities (
 id uuid primary key default gen_random_uuid(),
 kind build_forge.entity_kind not null,
 stable_key text not null check (length(stable_key) between 1 and 200),
 unique (kind,stable_key)
);
create table build_forge.entity_versions (
 id uuid primary key default gen_random_uuid(),
 entity_id uuid not null references build_forge.entities(id),
 version_id uuid not null references build_forge.game_versions(id),
 snapshot_id uuid not null,
 upstream_key text,
 class_key text,
 attributes jsonb not null default '{}' check (jsonb_typeof(attributes)='object'),
 review_state build_forge.review_state not null default 'pending',
 reviewed_at timestamptz,
 unique (entity_id,version_id),
 unique (id,version_id),
 foreign key (snapshot_id,version_id) references build_forge.snapshots(id,version_id),
 check (review_state <> 'approved' or reviewed_at is not null)
);
create table build_forge.entity_texts (
 entity_version_id uuid not null references build_forge.entity_versions(id) on delete cascade,
 locale text not null check (locale in ('tr','en','de')),
 name text not null check (length(name)>0),
 description text,
 translation_status text not null check (translation_status in ('original','draft','reviewed')),
 primary key (entity_version_id,locale)
);
-- Version-consistent graph supports prerequisites, slot restrictions, board connections, loot, rune pairings, etc.
create table build_forge.entity_relations (
 version_id uuid not null references build_forge.game_versions(id),
 from_version_id uuid not null,
 to_version_id uuid not null,
 relation_kind text not null check (relation_kind in ('fits_slot','belongs_to_class','has_affix','has_aspect','has_upgrade','requires','connects_to','contains','drops_from','crafts','socketable','pairs_with','uses_glyph','modifies','unlocks','replaces')),
 attributes jsonb not null default '{}' check (jsonb_typeof(attributes)='object'),
 primary key (version_id,from_version_id,to_version_id,relation_kind),
 foreign key (from_version_id,version_id) references build_forge.entity_versions(id,version_id),
 foreign key (to_version_id,version_id) references build_forge.entity_versions(id,version_id),
 check (from_version_id<>to_version_id)
);
-- Editorial, creator, or external-reference builds; never blindly copy third-party content.
create table build_forge.creators (
 id uuid primary key default gen_random_uuid(),
 display_name text not null,
 profile_url text,
 source_id uuid references build_forge.sources(id)
);
create table build_forge.builds (
 id uuid primary key default gen_random_uuid(),
 slug text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]*$'),
 creator_id uuid references build_forge.creators(id),
 origin text not null check (origin in ('first_party','creator_submission','licensed_partner','external_reference'))
);
create table build_forge.build_revisions (
 id uuid primary key default gen_random_uuid(),
 build_id uuid not null references build_forge.builds(id),
 version_id uuid not null references build_forge.game_versions(id),
 source_id uuid not null references build_forge.sources(id),
 revision integer not null check (revision>0),
 class_key text not null,
 purpose text not null check (purpose in ('leveling','endgame','bossing','speedfarm','pit','tower','pvp','other')),
 realm text not null check (realm in ('seasonal','eternal')),
 hardcore boolean not null default false,
 status build_forge.build_state not null default 'draft',
 source_url text,
 reviewed_at timestamptz,
 published_at timestamptz,
 unique (build_id,revision),
 unique (id,version_id),
 check (status <> 'published' or (reviewed_at is not null and published_at is not null))
);
create table build_forge.build_texts (
 revision_id uuid not null references build_forge.build_revisions(id) on delete cascade,
 locale text not null check (locale in ('tr','en','de')),
 title text not null,
 summary text,
 playstyle text,
 rotation text,
 notes text,
 review_state build_forge.review_state not null default 'pending',
 primary key (revision_id,locale)
);
create table build_forge.build_variants (
 id uuid primary key default gen_random_uuid(),
 revision_id uuid not null,
 version_id uuid not null,
 label text not null,
 unique (revision_id,label),
 unique (id,version_id),
 foreign key (revision_id,version_id) references build_forge.build_revisions(id,version_id)
);
-- The shared catalogue is referenced by builds, not duplicated into them.
create table build_forge.build_selections (
 variant_id uuid not null,
 version_id uuid not null,
 section text not null check (section in ('equipment','active_skill','skill_tree','paragon','rune','mercenary','war_plan','class_mechanic','season_mechanic','talisman','other')),
 slot_key text not null,
 entity_version_id uuid not null,
 settings jsonb not null default '{}' check (jsonb_typeof(settings)='object'),
 primary key (variant_id,section,slot_key),
 foreign key (variant_id,version_id) references build_forge.build_variants(id,version_id),
 foreign key (entity_version_id,version_id) references build_forge.entity_versions(id,version_id)
);
-- Tier ranking is independent editorial assessment for a specific activity/version.
create table build_forge.meta_assessments (
 id uuid primary key default gen_random_uuid(),
 revision_id uuid not null,
 version_id uuid not null,
 activity text not null,
 tier text not null check (tier in ('S','A','B','C','D')),
 methodology text not null,
 evidence_url text,
 reviewed_at timestamptz not null,
 unique (revision_id,activity),
 foreign key (revision_id,version_id) references build_forge.build_revisions(id,version_id)
);
create index entity_versions_version_class_idx on build_forge.entity_versions(version_id,class_key);
create index entity_versions_snapshot_idx on build_forge.entity_versions(snapshot_id);
create index relations_to_idx on build_forge.entity_relations(version_id,to_version_id);
create index build_revisions_search_idx on build_forge.build_revisions(version_id,class_key,purpose,status);
-- All tables are private by default; no anonymous/authenticated policies.
do $$
declare t record;
begin
 for t in select tablename from pg_tables where schemaname='build_forge' loop
  execute format('alter table build_forge.%I enable row level security',t.tablename);
 end loop;
end $$;
revoke all on all tables in schema build_forge from public, anon, authenticated;
revoke all on all sequences in schema build_forge from public, anon, authenticated;
-- Publication eligibility is always recalculated from source permission, snapshot,
-- version and entity review state, including after source revocation.
create view build_forge.publishable_catalog with (security_invoker=true) as
 select ev.id,ev.entity_id,ev.version_id,e.kind,e.stable_key,ev.class_key,ev.attributes,
        s.source_key,s.may_monetize,s.may_translate,ev.reviewed_at
 from build_forge.entity_versions ev
 join build_forge.entities e on e.id=ev.entity_id
 join build_forge.snapshots sn on sn.id=ev.snapshot_id and sn.version_id=ev.version_id
 join build_forge.sources s on s.id=sn.source_id
 where ev.review_state='approved' and sn.review_state='approved'
   and s.permission_state='approved' and s.may_publish;
create view build_forge.publishable_builds with (security_invoker=true) as
 select r.id,r.build_id,r.version_id,r.class_key,r.purpose,r.realm,r.hardcore,r.published_at,
        b.slug,b.origin,r.source_url,s.may_monetize
 from build_forge.build_revisions r
 join build_forge.builds b on b.id=r.build_id
 join build_forge.sources s on s.id=r.source_id
 where r.status='published' and s.permission_state='approved' and s.may_publish
 and exists(select 1 from build_forge.build_texts bt where bt.revision_id=r.id and bt.review_state='approved')
 and (b.origin='external_reference' or exists(select 1 from build_forge.build_variants v where v.revision_id=r.id))
 and not exists(select 1 from build_forge.build_variants v
    join build_forge.build_selections bs on bs.variant_id=v.id
    left join build_forge.publishable_catalog c on c.id=bs.entity_version_id
    where v.revision_id=r.id and c.id is null);
revoke all on build_forge.publishable_catalog,build_forge.publishable_builds from public,anon,authenticated;
commit;

-- Private S15 reconciliation queue, not a current-season catalog or publication.
begin;
create table build_forge.reconciliation_queue(
 id uuid primary key default gen_random_uuid(),
 target_version_id uuid not null references build_forge.game_versions(id),
 kind text not null,
 class_key text not null default '',
 candidate_key text not null,
 name_en text,
 name_tr text,
 legacy_refs jsonb not null default '[]'::jsonb check(jsonb_typeof(legacy_refs)='array'),
 identity_status text not null default 'unverified' check(identity_status in ('unverified','observed_in_season')),
 evidence_url text,
 evidence_patch text,
 evidence_note text,
 unique(target_version_id,kind,class_key,candidate_key),
 check(identity_status='unverified' or (evidence_url is not null and evidence_patch is not null and evidence_note is not null))
);
alter table build_forge.reconciliation_queue enable row level security;
revoke all on build_forge.reconciliation_queue from public,anon,authenticated;
with normalized as (
 select kind,coalesce(class_key,'') as class_key,
 case when kind in ('gear_item_reference','gear_aspect_reference') then lower(btrim(name_en))
 when kind='unique_variant' then legacy_id
 else coalesce(nullif(lower(btrim(legacy_key)),''),legacy_id) end as candidate_key,
 name_en,name_tr,legacy_table,legacy_id
 from build_forge.legacy_reference_index
), grouped as (
 select kind,class_key,candidate_key,max(nullif(btrim(name_en),'')) as name_en,max(nullif(btrim(name_tr),'')) as name_tr,
 jsonb_agg(distinct jsonb_build_object('table',legacy_table,'id',legacy_id)) as refs
 from normalized where candidate_key is not null and candidate_key<>'' group by kind,class_key,candidate_key
)
insert into build_forge.reconciliation_queue(target_version_id,kind,class_key,candidate_key,name_en,name_tr,legacy_refs)
select v.id,g.kind,g.class_key,g.candidate_key,g.name_en,g.name_tr,g.refs from grouped g cross join build_forge.game_versions v
where v.season=15 and v.patch='3.2.4' and v.channel='live' on conflict do nothing;
-- Specific factual identity observations from S15 patch 3.2.2; not an assertion of 3.2.4 values, ranks or rights.
update build_forge.reconciliation_queue q set identity_status='observed_in_season',
 name_en=case candidate_key when 'pulverize' then 'Pulverize' when 'incinerate' then 'Incinerate' when 'tal' then 'Tal' else name_en end,
 evidence_url='https://news.blizzard.com/en-us/article/24295395/diablo-iv-patch-notes-3-2',
 evidence_patch='3.2.2',evidence_note='Identity mentioned in official S15 change notes. Current attributes, rank and publication rights remain unverified.'
from build_forge.game_versions v where q.target_version_id=v.id and v.season=15 and v.patch='3.2.4' and v.channel='live' and
 ((q.kind='skill_unclassified' and q.class_key='druid' and q.candidate_key='pulverize')
 or (q.kind='skill_unclassified' and q.class_key='sorcerer' and q.candidate_key='incinerate')
 or (q.kind='rune' and q.candidate_key='tal'));
insert into build_forge.reconciliation_queue(target_version_id,kind,class_key,candidate_key,name_en,identity_status,evidence_url,evidence_patch,evidence_note)
select id,'rune','','sol','Sol','observed_in_season','https://news.blizzard.com/en-us/article/24295395/diablo-iv-patch-notes-3-2','3.2.2','Identity mentioned in official S15 change notes. No legacy match; current attributes and rights unverified.'
from build_forge.game_versions where season=15 and patch='3.2.4' and channel='live' on conflict do nothing;
create view build_forge.reconciliation_coverage with (security_invoker=true) as
select v.season,v.patch,v.channel,q.kind,count(*) as candidates,
 count(*) filter(where q.identity_status='observed_in_season') as season_identity_observations,
 count(*) filter(where q.identity_status='unverified') as unverified
from build_forge.reconciliation_queue q join build_forge.game_versions v on v.id=q.target_version_id group by v.season,v.patch,v.channel,q.kind;
revoke all on build_forge.reconciliation_coverage from public,anon,authenticated;
commit;

-- Private reference directory of class names; not a licensed skill/item dataset.
begin;
create table build_forge.class_directory (
 class_key text primary key check (class_key ~ '^[a-z0-9]+$'),
 name_en text not null,
 source_url text not null,
 verified_date date not null
);
alter table build_forge.class_directory enable row level security;
revoke all on build_forge.class_directory from public,anon,authenticated;
insert into build_forge.class_directory values
 ('barbarian','Barbarian','https://diablo4.blizzard.com/en-us/', '2026-11-27'),
 ('druid','Druid','https://diablo4.blizzard.com/en-us/', '2026-11-27'),
 ('necromancer','Necromancer','https://diablo4.blizzard.com/en-us/', '2026-11-27'),
 ('rogue','Rogue','https://diablo4.blizzard.com/en-us/', '2026-11-27'),
 ('sorcerer','Sorcerer','https://diablo4.blizzard.com/en-us/', '2026-11-27'),
 ('spiritborn','Spiritborn','https://diablo4.blizzard.com/en-us/', '2026-11-27'),
 ('paladin','Paladin','https://diablo4.blizzard.com/en-us/', '2026-11-27'),
 ('warlock','Warlock','https://diablo4.blizzard.com/en-us/', '2026-11-27');
-- Coverage includes zero rows. Class-independent entries are counted separately.
create view build_forge.catalog_coverage with (security_invoker=true) as
with counts as (
 select ev.version_id,e.kind,count(*) as stored,
 count(*) filter (where pc.id is not null and pc.may_monetize) as publishable,
 count(*) filter (where pc.id is not null and pc.may_monetize and
   (select count(*) from build_forge.entity_texts t where t.entity_version_id=ev.id
    and (t.translation_status='original' or (t.translation_status='reviewed' and pc.may_translate)))=3) as tr_en_de_ready
 from build_forge.entity_versions ev join build_forge.entities e on e.id=ev.entity_id
 left join build_forge.publishable_catalog pc on pc.id=ev.id
 group by ev.version_id,e.kind
)
select v.id as version_id,v.season,v.patch,v.channel,k.kind,
 coalesce(c.stored,0) as stored,coalesce(c.publishable,0) as publishable,coalesce(c.tr_en_de_ready,0) as tr_en_de_ready
from build_forge.game_versions v cross join unnest(enum_range(null::build_forge.entity_kind)) k(kind)
left join counts c on c.version_id=v.id and c.kind=k.kind;
create view build_forge.class_skill_coverage with (security_invoker=true) as
select v.id as version_id,v.season,v.patch,v.channel,d.class_key,d.name_en,k.kind,
 count(ev.id) as stored,
 count(pc.id) filter (where pc.may_monetize) as publishable
from build_forge.game_versions v cross join build_forge.class_directory d
cross join (values ('skill'::build_forge.entity_kind),('skill_passive'),('skill_upgrade'),('skill_tree'),('skill_node'),('class_mechanic')) k(kind)
left join (build_forge.entity_versions ev join build_forge.entities e on e.id=ev.entity_id)
 on ev.version_id=v.id and ev.class_key=d.class_key and e.kind=k.kind
left join build_forge.publishable_catalog pc on pc.id=ev.id
group by v.id,v.season,v.patch,v.channel,d.class_key,d.name_en,k.kind;
revoke all on build_forge.catalog_coverage,build_forge.class_skill_coverage from public,anon,authenticated;
commit;

-- Read-only legacy reference inventory. No old rows copied, modified, or relabelled.
begin;
create view build_forge.legacy_reference_index with (security_invoker=true) as
select 'skill_unclassified'::text as kind,'d4_skills_tr'::text as legacy_table,id::text as legacy_id,
 lower(class_key) as class_key,key as legacy_key,name_en,name_tr
from public.d4_skills_tr
union all select 'skill_unclassified','tmp_d4_skills_barbarian_tr',key,lower(class_key),key,null,name_tr from public.tmp_d4_skills_barbarian_tr
union all select 'skill_unclassified','tmp_d4_skills_druid_tr',key,lower(class_key),key,null,name_tr from public.tmp_d4_skills_druid_tr
union all select 'skill_unclassified','tmp_d4_skills_necromancer_tr',key,lower(class_key),key,null,name_tr from public.tmp_d4_skills_necromancer_tr
union all select 'skill_unclassified','tmp_d4_skills_rogue_tr',key,lower(class_key),key,null,name_tr from public.tmp_d4_skills_rogue_tr
union all select 'skill_unclassified','tmp_d4_skills_sorcerer_tr',key,lower(class_key),key,null,name_tr from public.tmp_d4_skills_sorcerer_tr
union all select 'skill_unclassified','tmp_d4_skills_spiritborn_tr',key,lower(class_key),key,null,name_tr from public.tmp_d4_skills_spiritborn_tr
union all select 'unique','d4_uniques',id::text,lower(class_key),slug,name_en,name_tr from public.d4_uniques
union all select 'unique_variant','d4_unique_variants',id::text,lower(class_key),unique_slug,name_en,name_tr from public.d4_unique_variants
union all select 'aspect','d4_legendary_aspects',id::text,lower(class_key),slug,name_en,name_tr from public.d4_legendary_aspects
union all select 'paragon_board','d4_paragon_boards',id::text,lower(class_key),slug,name_en,name_tr from public.d4_paragon_boards
union all select 'glyph','d4_paragon_glyphs',id::text,lower(class_key),slug,name_en,name_tr from public.d4_paragon_glyphs
union all select 'rune','d4_runes',id::text,null,slug,name_en,name_tr from public.d4_runes
union all select 'temper_manual','d4_tempering_manuals',id::text,lower(class_key),slug,name_en,name_tr from public.d4_tempering_manuals
union all select 'gear_slot','build_gear_slots',id::text,null,slot_key,slot_key,null from public.build_gear_slots
union all select 'gear_item_reference','build_gear_slots',id::text,null,slot_key,unique_name,null from public.build_gear_slots where nullif(btrim(unique_name),'') is not null
union all select 'gear_aspect_reference','build_gear_slots',id::text,null,slot_key,aspect_name,null from public.build_gear_slots where nullif(btrim(aspect_name),'') is not null;
create view build_forge.legacy_skill_inventory with (security_invoker=true) as
select c.class_key,c.name_en,count(i.legacy_table) as reference_rows,
 count(distinct nullif(lower(btrim(i.legacy_key)),'')) as distinct_candidate_keys,
 count(distinct nullif(lower(btrim(i.legacy_key)),'')) filter(where nullif(btrim(i.name_en),'') is not null) as candidate_keys_with_english
from build_forge.class_directory c left join build_forge.legacy_reference_index i
on i.class_key=c.class_key and i.kind='skill_unclassified'
group by c.class_key,c.name_en;
create view build_forge.legacy_reference_coverage with (security_invoker=true) as
select kind,count(*) as reference_rows,count(distinct (coalesce(class_key,''),coalesce(nullif(btrim(legacy_key),''),legacy_id))) as distinct_candidate_keys,
 'historical_unverified'::text as status
from build_forge.legacy_reference_index group by kind;
revoke all on build_forge.legacy_reference_index,build_forge.legacy_skill_inventory,build_forge.legacy_reference_coverage from public,anon,authenticated;
commit;

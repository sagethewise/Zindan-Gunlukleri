-- Private, transactional staging of authorized normalized catalog bundles.
begin;
create function build_forge.stage_catalog(p_bundle jsonb)
returns jsonb language plpgsql security invoker set search_path=pg_catalog,build_forge as $$
declare
 src build_forge.sources%rowtype;
 ver build_forge.game_versions%rowtype;
 sn uuid; ent uuid; ev uuid; f uuid; t uuid;
 item jsonb; txt jsonb; edge jsonb; locale text; digest text;
begin
 if jsonb_typeof(p_bundle) is distinct from 'object' or p_bundle->>'schemaVersion' is distinct from '1'
 or jsonb_typeof(p_bundle->'entities') is distinct from 'array'
 or jsonb_typeof(p_bundle->'relations') is distinct from 'array' then
  raise exception 'Invalid normalized bundle';
 end if;
 if jsonb_array_length(p_bundle->'entities') not between 1 and 10000
 or jsonb_array_length(p_bundle->'relations')>50000 then raise exception 'Bundle limits exceeded'; end if;
 select * into src from build_forge.sources where source_key=p_bundle->>'sourceKey' for share;
 if not found or src.permission_state<>'approved' or not src.may_store then
  raise exception 'Source is not approved for storage';
 end if;
 select * into ver from build_forge.game_versions where patch=p_bundle->>'patch' and channel=p_bundle->>'channel' for update;
 if not found then raise exception 'Register verified game version first'; end if;
 if coalesce(p_bundle->>'sourceUrl','') !~ '^https://[^[:space:]]+$' then raise exception 'HTTPS provenance URL required'; end if;
 digest:=encode(sha256(convert_to(p_bundle::text,'UTF8')),'hex');
 insert into build_forge.snapshots(source_id,version_id,original_url,sha256)
 values(src.id,ver.id,p_bundle->>'sourceUrl',digest) returning id into sn;
 for item in select value from jsonb_array_elements(p_bundle->'entities') loop
  if jsonb_typeof(item->'attributes') is distinct from 'object' or jsonb_typeof(item->'texts') is distinct from 'object'
  or coalesce(item->>'stableKey','') !~ '^[a-z0-9][a-z0-9._:-]{0,199}$' then raise exception 'Invalid entity'; end if;
  if not (item->'texts' ? (p_bundle->>'originalLocale')) or p_bundle->>'originalLocale' is null
  or p_bundle->>'originalLocale' not in ('tr','en','de') then raise exception 'Original locale required'; end if;
  if not src.may_translate and (select count(*) from jsonb_object_keys(item->'texts'))>1 then raise exception 'Source does not permit translations'; end if;
  insert into build_forge.entities(kind,stable_key) values((item->>'kind')::build_forge.entity_kind,item->>'stableKey')
   on conflict(kind,stable_key) do nothing;
  select id into ent from build_forge.entities where kind=(item->>'kind')::build_forge.entity_kind and stable_key=item->>'stableKey';
  insert into build_forge.entity_versions(entity_id,version_id,snapshot_id,upstream_key,class_key,attributes)
   values(ent,ver.id,sn,item->>'upstreamKey',item->>'classKey',item->'attributes') returning id into ev;
  for locale,txt in select key,value from jsonb_each(item->'texts') loop
   if jsonb_typeof(txt->'name') is distinct from 'string' or length(btrim(txt->>'name')) not between 1 and 300 then raise exception 'Invalid name'; end if;
   insert into build_forge.entity_texts(entity_version_id,locale,name,description,translation_status)
   values(ev,locale,txt->>'name',txt->>'description',case when locale=p_bundle->>'originalLocale' then 'original' else 'draft' end);
  end loop;
 end loop;
 for edge in select value from jsonb_array_elements(p_bundle->'relations') loop
  select e.id into f from build_forge.entity_versions e join build_forge.entities x on x.id=e.entity_id
   where e.snapshot_id=sn and x.kind=(edge->'from'->>'kind')::build_forge.entity_kind and x.stable_key=edge->'from'->>'stableKey';
  select e.id into t from build_forge.entity_versions e join build_forge.entities x on x.id=e.entity_id
   where e.snapshot_id=sn and x.kind=(edge->'to'->>'kind')::build_forge.entity_kind and x.stable_key=edge->'to'->>'stableKey';
  if f is null or t is null then raise exception 'Relation endpoints must belong to this bundle'; end if;
  insert into build_forge.entity_relations(version_id,from_version_id,to_version_id,relation_kind,attributes)
  values(ver.id,f,t,edge->>'kind',edge->'attributes');
 end loop;
 return jsonb_build_object('snapshotId',sn,'sha256',digest,'entities',jsonb_array_length(p_bundle->'entities'),'relations',jsonb_array_length(p_bundle->'relations'),'reviewState','pending');
end $$;
revoke all on function build_forge.stage_catalog(jsonb) from public,anon,authenticated;
commit;

-- Private candidate export, exact patch and permission gates. No public access,
-- automatic publication, game data import, or changes to the legacy schema.
begin;
create function build_forge.export_reviewed_catalog(p_season integer,p_patch text,p_channel text)
returns jsonb language sql stable security invoker set search_path=pg_catalog,build_forge as $$
 with eligible as (
  select c.id,c.kind,c.class_key,c.version_id,c.reviewed_at,v.patch,v.channel,
   s.name as source_name,s.homepage_url as public_source_url,
   (select jsonb_object_agg(t.locale,jsonb_strip_nulls(jsonb_build_object('name',t.name,'description',t.description)))
    from build_forge.entity_texts t
    where t.entity_version_id=c.id and (t.translation_status='original' or (t.translation_status='reviewed' and c.may_translate))) as texts
  from build_forge.publishable_catalog c
  join build_forge.game_versions v on v.id=c.version_id
  join build_forge.sources s on s.source_key=c.source_key
  where v.season=p_season and v.patch=p_patch and v.channel=p_channel
    and v.season in (15,16) and c.may_monetize
    -- Public source homepages only, not raw snapshot URLs or credential-bearing URLs.
    and s.homepage_url ~ '^https://[A-Za-z0-9.-]+(/[^?#[:space:]]*)?$'
 ), visible as (select * from eligible where texts is not null)
 select jsonb_build_object('version',1,'entries',coalesce((
  select jsonb_agg(jsonb_strip_nulls(jsonb_build_object('id',id,'kind',kind,'patch',patch,'channel',channel,'classKey',class_key,
   'source',jsonb_build_object('name',source_name,'url',public_source_url,'reviewedDate',to_char(reviewed_at at time zone 'UTC','YYYY-MM-DD')),
   'texts',texts)) order by id) from visible),'[]'::jsonb),
  'relations',coalesce((
   select jsonb_agg(jsonb_strip_nulls(jsonb_build_object('fromId',r.from_version_id,'toId',r.to_version_id,'kind',r.relation_kind,
   'range',case when r.relation_kind='has_affix' and jsonb_typeof(r.attributes->'rollMin')='number'
     and jsonb_typeof(r.attributes->'rollMax')='number' and r.attributes->>'unit' in ('flat','percent','seconds','ranks')
     then case when (r.attributes->>'rollMin')::numeric <= (r.attributes->>'rollMax')::numeric
       then jsonb_build_object('min',r.attributes->'rollMin','max',r.attributes->'rollMax','unit',r.attributes->>'unit') end
     end)) order by r.from_version_id,r.to_version_id,r.relation_kind)
   from build_forge.entity_relations r join visible f on f.id=r.from_version_id join visible t on t.id=r.to_version_id
   where r.version_id=f.version_id and r.version_id=t.version_id
  ),'[]'::jsonb))
$$;
revoke all on function build_forge.export_reviewed_catalog(integer,text,text) from public,anon,authenticated;
-- Build graph is an intermediate candidate artifact, not the old flattened public-builds file.
-- Every chosen entity must exist in the exact reviewed catalog version. Settings and raw notes
-- are deliberately omitted until a field-specific export contract has been reviewed.
create function build_forge.export_reviewed_build_graph(p_season integer,p_patch text,p_channel text)
returns jsonb language sql stable security invoker set search_path=pg_catalog,build_forge as $$
 with catalog as (
  select (entry->>'id')::uuid as id from jsonb_array_elements(build_forge.export_reviewed_catalog(p_season,p_patch,p_channel)->'entries') entry
 ), eligible as (
  select pb.*,v.season,v.patch,v.channel,s.name as source_name,s.homepage_url as public_source_url,
   (select jsonb_object_agg(t.locale,jsonb_strip_nulls(jsonb_build_object('title',t.title,'summary',t.summary)))
    from build_forge.build_texts t where t.revision_id=pb.id and t.review_state='approved'
    -- Build text schema lacks an original-language flag; require translate permission for multilingual export.
    and s.may_translate) as texts
  from build_forge.publishable_builds pb
  join build_forge.game_versions v on v.id=pb.version_id
  join build_forge.build_revisions br on br.id=pb.id
  join build_forge.sources s on s.id=br.source_id
  where v.season=p_season and v.patch=p_patch and v.channel=p_channel and v.season in (15,16)
   and pb.may_monetize and pb.origin<>'external_reference'
   and s.homepage_url ~ '^https://[A-Za-z0-9.-]+(/[^?#[:space:]]*)?$'
   and exists(select 1 from build_forge.build_variants bv join build_forge.build_selections bs on bs.variant_id=bv.id where bv.revision_id=pb.id)
   and not exists(select 1 from build_forge.build_variants bv join build_forge.build_selections bs on bs.variant_id=bv.id
     where bv.revision_id=pb.id and not exists(select 1 from catalog c where c.id=bs.entity_version_id))
 ), visible as (select * from eligible where texts is not null)
 select jsonb_build_object('version',1,'entries',coalesce((
  select jsonb_agg(jsonb_build_object('id',b.id,'slug',b.slug,'season',b.season,'patch',b.patch,'channel',b.channel,
  'classKey',b.class_key,'purpose',b.purpose,'realm',b.realm,'hardcore',b.hardcore,
  'source',jsonb_build_object('name',b.source_name,'url',b.public_source_url),'texts',b.texts,
  'variants',(select jsonb_agg(jsonb_build_object('id',bv.id,'label',bv.label,'selections',coalesce((
   select jsonb_agg(jsonb_build_object('section',bs.section,'slotKey',bs.slot_key,'entityId',bs.entity_version_id) order by bs.section,bs.slot_key)
   from build_forge.build_selections bs where bs.variant_id=bv.id),'[]'::jsonb)) order by bv.id)
   from build_forge.build_variants bv where bv.revision_id=b.id)) order by b.id)
  from visible b),'[]'::jsonb))
$$;
revoke all on function build_forge.export_reviewed_build_graph(integer,text,text) from public,anon,authenticated;
commit;

-- Internal-only dry run. Do not publish reference data from this query.
-- Retain queue IDs and version boundaries; never infer patch equivalence.
with matches as (
 select candidate_id,'skill' as family,source_commit,game_build,upstream_key
 from build_forge.skill_identity_candidates
 union all
 select candidate_id,'aspect',source_commit,game_build,aspect_id::text
 from build_forge.aspect_identity_candidates
 union all
 select candidate_id,'item',source_commit,game_build,upstream_key
 from build_forge.item_identity_candidates
), distinct_matches as (
 select distinct candidate_id,family,source_commit,game_build,upstream_key
 from matches where upstream_key is not null
), summary as (
 select candidate_id,count(*) as match_count,
 jsonb_agg(jsonb_build_object('family',family,'source_commit',source_commit,
 'game_build',game_build,'upstream_key',upstream_key)
 order by family,source_commit,game_build,upstream_key) as references
 from distinct_matches group by candidate_id
)
select q.id as queue_id,q.target_version_id,g.season,g.patch,g.channel,
 q.kind,q.class_key,q.candidate_key,q.identity_status,
 coalesce(s.match_count,0) as reference_count,
 coalesce(s.references,'[]'::jsonb) as reference_candidates,
 case when coalesce(s.match_count,0)=0 then 'needs_reference'
 when s.match_count>1 then 'needs_disambiguation'
 else 'needs_patch_and_permission_review' end as next_action
from build_forge.reconciliation_queue q
join build_forge.game_versions g on g.id=q.target_version_id
left join summary s on s.candidate_id=q.id
order by g.season,g.patch,q.kind,q.id;

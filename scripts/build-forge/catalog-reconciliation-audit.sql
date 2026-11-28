-- Read-only diagnostic; uses existing candidate views, not raw catalog imports.
-- A single reference is an identity candidate, not a confirmed season match.
-- No promotion, publication, permission changes or writes.
-- Multiple source builds/commits are intentionally counted separately.
with matches as (
 select candidate_id, 'skill' as family, source_commit, game_build, upstream_key from build_forge.skill_identity_candidates
 union all select candidate_id,'aspect',source_commit,game_build,aspect_id::text from build_forge.aspect_identity_candidates
 union all select candidate_id,'item',source_commit,game_build,upstream_key from build_forge.item_identity_candidates
), dedup as (
 select distinct candidate_id,family,source_commit,game_build,upstream_key from matches where upstream_key is not null
), tally as (
 select candidate_id,count(*) as match_count from dedup group by candidate_id
)
select g.season,g.patch,q.kind,count(*) as existing_candidates,
 count(*) filter(where coalesce(t.match_count,0)=0) as unmatched,
 count(*) filter(where t.match_count=1) as single_reference,
 count(*) filter(where t.match_count>1) as ambiguous
from build_forge.reconciliation_queue q join build_forge.game_versions g on g.id=q.target_version_id
left join tally t on t.candidate_id=q.id
group by g.season,g.patch,q.kind order by g.season,g.patch,q.kind;

-- Source permissions must be checked independently before any future import.
select source_key, permission_state, may_store, may_publish, may_translate, may_monetize
from build_forge.sources order by source_key;

-- Existing coverage baseline.
select (select count(*) from build_forge.reconciliation_queue) as queue,
       (select count(*) from build_forge.upstream_reference_index) as upstream_refs,
       (select count(*) from build_forge.entity_versions) as entity_versions,
       (select count(*) from build_forge.publishable_catalog) as publishable;

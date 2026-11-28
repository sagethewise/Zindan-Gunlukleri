import test from "node:test";import assert from "node:assert/strict";import {readFileSync} from "node:fs";
const {PGlite}=await import(process.env.PGLITE_MODULE||"@electric-sql/pglite");
test("S15 candidate queue preserves old identity, excludes publication, and tracks limited official observations",async()=>{
const db=new PGlite();try{
await db.exec("create role anon; create role authenticated;");
for(const n of ["001_build_forge_catalog","002_build_forge_source_registry","003_build_forge_import","004_build_forge_season_sources","005_build_forge_reviewed_export","006_build_forge_class_coverage"])await db.exec(readFileSync(new URL("../supabase/migrations/202611270"+n+".sql",import.meta.url),"utf8"));
await db.exec("create view build_forge.legacy_reference_index as select 'skill_unclassified'::text kind,'fixture'::text legacy_table,'a'::text legacy_id,'druid'::text class_key,'pulverize'::text legacy_key,null::text name_en,'Fixture'::text name_tr;");
await db.exec(readFileSync(new URL("../supabase/migrations/202611270008_build_forge_season15_reconciliation.sql",import.meta.url),"utf8"));
const rows=(await db.query("select candidate_key,identity_status,evidence_patch from build_forge.reconciliation_queue order by candidate_key")).rows;assert.deepEqual(rows,[{candidate_key:"pulverize",identity_status:"observed_in_season",evidence_patch:"3.2.2"},{candidate_key:"sol",identity_status:"observed_in_season",evidence_patch:"3.2.2"}]);
assert.equal(Number((await db.query("select count(*) from build_forge.entity_versions")).rows[0].count),0);
await db.exec("set role anon");await assert.rejects(db.query("select * from build_forge.reconciliation_queue"),/permission denied/);
}finally{await db.close()}
});

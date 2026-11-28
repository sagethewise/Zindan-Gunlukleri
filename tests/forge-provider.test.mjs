import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const {PGlite}=await import(process.env.PGLITE_MODULE||"@electric-sql/pglite");
test("source review records and patch versions do not grant permissions or ingest any records",async()=>{
 const db=new PGlite();try{
 await db.exec("create role anon; create role authenticated;");
 for(const n of ["202611270001_build_forge_catalog","202611270002_build_forge_source_registry","202611270003_build_forge_import","202611270004_build_forge_season_sources"])await db.exec(readFileSync(new URL("../supabase/migrations/"+n+".sql",import.meta.url),"utf8"));
 const source=(await db.query("select permission_state,may_store,may_publish,may_translate,may_monetize from build_forge.sources where source_key='infinitybuilds'")).rows[0];
 assert.deepEqual(source,{permission_state:"pending",may_store:false,may_publish:false,may_translate:false,may_monetize:false});
 const versions=(await db.query("select patch,season,channel from build_forge.game_versions order by season")).rows;assert.deepEqual(versions,[{patch:"3.2.4",season:15,channel:"live"},{patch:"3.3.0",season:16,channel:"ptr"}]);
 assert.equal(Number((await db.query("select count(*) from build_forge.snapshots")).rows[0].count),0);
 }finally{await db.close()}
});

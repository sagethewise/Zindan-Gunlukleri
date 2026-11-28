import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";
const {PGlite}=await import(process.env.PGLITE_MODULE||"@electric-sql/pglite");
test("eight real class names, zero-inclusive coverage for all kinds and skill categories",async()=>{
 const db=new PGlite();try{
 await db.exec("create role anon; create role authenticated;");
 for(const suffix of ["001_build_forge_catalog","002_build_forge_source_registry","003_build_forge_import","004_build_forge_season_sources","005_build_forge_reviewed_export","006_build_forge_class_coverage"])await db.exec(readFileSync(new URL("../supabase/migrations/202611270"+suffix+".sql",import.meta.url),"utf8"));
 const q=async(s)=>(await db.query(s)).rows;
 assert.equal((await q("select * from build_forge.class_directory")).length,8);
 const coverage=await q("select * from build_forge.catalog_coverage");assert.equal(coverage.length,68);assert.ok(coverage.every(r=>Number(r.stored)===0));
 const skills=await q("select * from build_forge.class_skill_coverage");assert.equal(skills.length,96);assert.ok(skills.every(r=>Number(r.stored)===0));
 await db.exec("set role anon");await assert.rejects(q("select * from build_forge.class_skill_coverage"),/permission denied/);
 }finally{await db.close()}
});

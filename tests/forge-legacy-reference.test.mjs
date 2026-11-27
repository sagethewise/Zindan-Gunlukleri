import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const {PGlite}=await import(process.env.PGLITE_MODULE||"@electric-sql/pglite");
test("historical references merge candidate keys by class without promoting to current catalog",async()=>{
 const db=new PGlite();try{
 await db.exec("create role anon; create role authenticated;");
 const migration=async(name)=>db.exec(readFileSync(new URL("../supabase/migrations/"+name+".sql",import.meta.url),"utf8"));
 for(const n of ["202611270001_build_forge_catalog","202611270002_build_forge_source_registry","202611270003_build_forge_import","202611270004_build_forge_season_sources","202611270005_build_forge_reviewed_export","202611270006_build_forge_class_coverage"])await migration(n);
 await db.exec("create table public.d4_skills_tr(id int,class_key text,key text,name_en text,name_tr text); create table public.build_gear_slots(id int,slot_key text,unique_name text,aspect_name text);");
 for(const k of ["barbarian","druid","necromancer","rogue","sorcerer","spiritborn"])await db.exec("create table public.tmp_d4_skills_"+k+"_tr(key text,class_key text,name_tr text)");
 for(const t of ["d4_uniques","d4_legendary_aspects","d4_paragon_boards","d4_paragon_glyphs","d4_runes","d4_tempering_manuals"])await db.exec("create table public."+t+"(id int,class_key text,slug text,name_en text,name_tr text)");
 await db.exec("create table public.d4_unique_variants(id int,class_key text,unique_slug text,name_en text,name_tr text); insert into public.d4_skills_tr values(1,'barbarian','fixture','Synthetic','Fixture');insert into public.tmp_d4_skills_barbarian_tr values('fixture','barbarian','Fixture');insert into public.build_gear_slots values(1,'helm','Fixture item',null);");
 await migration("202611270007_build_forge_legacy_reference");
 const rows=(await db.query("select * from build_forge.legacy_skill_inventory order by class_key")).rows;
 assert.equal(rows.length,8);assert.equal(Number(rows[0].reference_rows),2);assert.equal(Number(rows[0].distinct_candidate_keys),1);
 assert.equal(Number((await db.query("select count(*) from build_forge.entity_versions")).rows[0].count),0);
 await db.exec("set role anon");await assert.rejects(db.query("select * from build_forge.legacy_reference_index"),/permission denied/);
 }finally{await db.close()}
});

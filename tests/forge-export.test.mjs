import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const {PGlite}=await import(process.env.PGLITE_MODULE||"@electric-sql/pglite");
test("reviewed export uses exact season, rights, review, locale and graph integrity; revocation removes both",async()=>{
 const db=new PGlite();try{
 await db.exec("create role anon; create role authenticated;");
 for(const n of ["202611270001_build_forge_catalog","202611270002_build_forge_source_registry","202611270003_build_forge_import","202611270004_build_forge_season_sources","202611270005_build_forge_reviewed_export"])await db.exec(readFileSync(new URL("../supabase/migrations/"+n+".sql",import.meta.url),"utf8"));
 const q=async(s,p=[])=>db.query(s,p),one=async(s,p=[]) => (await q(s,p)).rows[0], ins=async(s,p=[]) => (await one(s+" returning id",p)).id;
 const src=await ins("insert into build_forge.sources(source_key,name,homepage_url,source_kind,permission_state,permission_evidence,reviewed_at,may_store,may_publish,may_monetize,may_translate) values ('fixture-export','Synthetic fixture','https://example.org/','first_party','approved','test only',now(),true,true,true,true)");
 const v=(await one("select id from build_forge.game_versions where season=15 and channel='live'")).id;
 const sn=await ins("insert into build_forge.snapshots(source_id,version_id,sha256,original_url,review_state,reviewed_at) values ($1,$2,$3,'https://example.org/private?token=synthetic','approved',now())",[src,v,"c".repeat(64)]);
 const entity=async(kind,key)=>{const e=await ins("insert into build_forge.entities(kind,stable_key) values ($1,$2)",[kind,key]);return ins("insert into build_forge.entity_versions(entity_id,version_id,snapshot_id,review_state,reviewed_at,attributes) values ($1,$2,$3,'approved',now(),'{\"private\":\"fixture\"}')",[e,v,sn])};
 const item=await entity("item","fixture-item"),affix=await entity("affix","fixture-affix");
 for(const id of [item,affix]){await q("insert into build_forge.entity_texts(entity_version_id,locale,name,translation_status) values ($1,'en','Synthetic fixture','original'),($1,'de','Draft translation','draft'),($1,'tr','Reviewed translation','reviewed')",[id]);}
 await q("insert into build_forge.entity_relations(version_id,from_version_id,to_version_id,relation_kind,attributes) values ($1,$2,$3,'has_affix','{\"rollMin\":1,\"rollMax\":2,\"unit\":\"percent\",\"private\":\"fixture\"}')",[v,item,affix]);
 const build=await ins("insert into build_forge.builds(slug,origin) values ('synthetic-build','first_party')");
 const rev=await ins("insert into build_forge.build_revisions(build_id,version_id,source_id,revision,class_key,purpose,realm,status,reviewed_at,published_at) values ($1,$2,$3,1,'test','endgame','seasonal','published',now(),now())",[build,v,src]);
 await q("insert into build_forge.build_texts(revision_id,locale,title,review_state) values ($1,'en','Synthetic build','approved'),($1,'de','Draft','pending')",[rev]);
 const variant=await ins("insert into build_forge.build_variants(revision_id,version_id,label) values ($1,$2,'Fixture')",[rev,v]);
 await q("insert into build_forge.build_selections(variant_id,version_id,section,slot_key,entity_version_id) values ($1,$2,'equipment','helm',$3)",[variant,v,item]);
 const catalog=async(season=15,patch="3.2.4",channel="live")=>(await one("select build_forge.export_reviewed_catalog($1,$2,$3) as result",[season,patch,channel])).result;
 const graph=async()=>(await one("select build_forge.export_reviewed_build_graph(15,'3.2.4','live') as result")).result;
 let c=await catalog();assert.equal(c.entries.length,2);assert.equal(c.relations.length,1);assert.deepEqual(c.relations[0].range,{min:1,max:2,unit:"percent"});assert.equal(c.relations[0].private,undefined);assert.equal(c.entries[0].texts.de,undefined);assert.equal(c.entries[0].source.url,"https://example.org/");assert.equal(c.entries[0].attributes,undefined);assert.equal((await catalog(16,"3.3.0","ptr")).entries.length,0);
 let g=await graph();assert.equal(g.entries.length,1);assert.equal(g.entries[0].variants[0].selections[0].entityId,item);assert.equal(g.entries[0].texts.de,undefined);
 await q("update build_forge.sources set may_translate=false where id=$1",[src]);assert.equal((await catalog()).entries[0].texts.tr,undefined);assert.equal((await graph()).entries.length,0);
 await q("update build_forge.sources set may_translate=true, may_monetize=false where id=$1",[src]);assert.equal((await catalog()).entries.length,0);assert.equal((await graph()).entries.length,0);
 await q("update build_forge.sources set may_monetize=true where id=$1",[src]);await q("update build_forge.entity_versions set review_state='revoked' where id=$1",[item]);assert.equal((await catalog()).relations.length,0);assert.equal((await graph()).entries.length,0);
 await q("update build_forge.sources set permission_state='revoked' where id=$1",[src]);assert.equal((await catalog()).entries.length,0);
 await db.exec("set role anon");await assert.rejects(catalog(),/permission denied/);await db.exec("reset role");
 }finally{await db.close()}
});

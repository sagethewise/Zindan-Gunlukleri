import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import path from "node:path";
const kinds=new Set("class equipment_slot item_type item aspect affix temper_manual gem material skill skill_upgrade skill_passive skill_tree skill_node paragon_board paragon_node glyph rune runeword mercenary mercenary_skill seal charm talisman war_plan war_plan_node class_mechanic season_mechanic activity boss loot_source craft_recipe stat formula".split(" "));
const relationKinds=new Set("fits_slot belongs_to_class has_affix has_aspect has_upgrade requires connects_to contains drops_from crafts socketable pairs_with uses_glyph modifies unlocks replaces".split(" "));
const locales=["tr","en","de"];
const obj=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const key=x=>typeof x==="string"&&/^[a-z0-9][a-z0-9._:-]{0,199}$/.test(x);
const check=(v,msg)=>{if(!v)throw Error(msg)};
const id=e=>e.kind+":"+e.stableKey;
const exact=(x,fields)=>obj(x)&&Object.keys(x).every(k=>fields.includes(k));
export function inspectBundle(b){
 check(exact(b,["schemaVersion","sourceKey","sourceUrl","patch","channel","originalLocale","entities","relations"])&&b.schemaVersion===1,"Invalid bundle schema");
 check(typeof b.sourceKey==="string"&&/^[a-z0-9_-]+$/.test(b.sourceKey)&&typeof b.patch==="string"&&b.patch.trim()&&b.patch.length<=80&&["live","ptr","historical"].includes(b.channel)&&locales.includes(b.originalLocale),"Invalid source, patch, channel or locale");
 const u=new URL(b.sourceUrl);check(u.protocol==="https:"&&!u.username&&!u.password,"HTTPS provenance URL required");
 check(Array.isArray(b.entities)&&b.entities.length>=1&&b.entities.length<=10000&&Array.isArray(b.relations)&&b.relations.length<=50000,"Bundle limits exceeded");
 const ids=new Set(),edges=new Set(),coverage={},translations={tr:0,en:0,de:0};
 for(const e of b.entities){
  check(exact(e,["kind","stableKey","classKey","upstreamKey","attributes","texts"])&&kinds.has(e.kind)&&key(e.stableKey)&&obj(e.attributes)&&obj(e.texts),"Invalid entity");
  check(e.classKey==null||key(e.classKey),"Invalid class key");
  check(e.upstreamKey==null||typeof e.upstreamKey==="string","Invalid upstream key");
  check(!ids.has(id(e)),"Duplicate entity "+id(e));ids.add(id(e));coverage[e.kind]=(coverage[e.kind]??0)+1;
  check(Object.hasOwn(e.texts,b.originalLocale),"Original locale missing");
  for(const [l,t] of Object.entries(e.texts)){check(locales.includes(l)&&exact(t,["name","description"])&&typeof t.name==="string"&&t.name.trim()&&t.name.length<=300&&(t.description==null||typeof t.description==="string"),"Invalid localized name or description");translations[l]++}
 }
 for(const r of b.relations){
  check(exact(r,["from","to","kind","attributes"])&&exact(r.from,["kind","stableKey"])&&exact(r.to,["kind","stableKey"])&&relationKinds.has(r.kind)&&obj(r.attributes),"Invalid relationship");
  const a=id(r.from),z=id(r.to),k=JSON.stringify([a,z,r.kind]);check(ids.has(a)&&ids.has(z)&&a!==z,"Unknown or self-referencing relationship");check(!edges.has(k),"Duplicate relationship");edges.add(k);
 }
 return {sourceKey:b.sourceKey,patch:b.patch,channel:b.channel,entities:ids.size,relations:edges.size,coverage,translations,requiredReview:"pending",fileDigest: createHash("sha256").update(JSON.stringify(b)).digest("hex")};
}
export function stageSql(b){inspectBundle(b);const encoded=Buffer.from(JSON.stringify(b)).toString("base64");return "select build_forge.stage_catalog(convert_from(decode('"+encoded+"','base64'),'UTF8')::jsonb);\n";}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){try{const [cmd,file]=process.argv.slice(2);check(["inspect","sql"].includes(cmd)&&file,"Usage: catalog.mjs inspect|sql bundle.json");const b=JSON.parse(readFileSync(file,"utf8"));console.log(cmd==="inspect"?JSON.stringify(inspectBundle(b),null,2):stageSql(b))}catch(e){console.error(e.message);process.exitCode=1}}

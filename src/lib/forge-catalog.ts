export const groups = {
 equipment:["equipment_slot","item_type","item","aspect","affix","temper_manual","gem","material","craft_recipe"],
 skills:["class","skill","skill_upgrade","skill_passive","skill_tree","skill_node"],
 paragon:["paragon_board","paragon_node","glyph"],
 runes:["rune","runeword"],
 systems:["mercenary","mercenary_skill","seal","charm","talisman","war_plan","war_plan_node","class_mechanic","season_mechanic"],
 world:["activity","boss","loot_source","stat","formula"],
} as const;
export type Group=keyof typeof groups;
export type Kind=typeof groups[Group][number];
export type Lang="tr"|"en"|"de";
export type CatalogEntry={id:string;kind:Kind;patch:string;channel:"live"|"ptr"|"historical";classKey?:string;source:{name:string;url:string;reviewedDate:string};texts:Partial<Record<Lang,{name:string;description?:string}>>;reference?:true;aliases?:string[]};
export type CatalogFilter={group:Group|"all";kind:Kind|"all";patch:string;channel:string;classKey:string;query:string};
export const defaultFilter:CatalogFilter={group:"all",kind:"all",patch:"",channel:"",classKey:"",query:""};
export const allKinds=Object.values(groups).flat() as Kind[];
export function filterCatalog(entries:CatalogEntry[],locale:Lang,f:CatalogFilter){
 const query=f.query.trim().toLocaleLowerCase(locale);
 return entries.filter(e=>{
  const t=e.texts[locale];if(!t)return false;
  return (f.group==="all"|| (groups[f.group] as readonly Kind[]).includes(e.kind))&&(f.kind==="all"||e.kind===f.kind)&&(!f.patch||e.patch===f.patch)&&(!f.channel||e.channel===f.channel)&&(!f.classKey||e.classKey===f.classKey)&&(!query||[t.name,t.description??"",...(e.reference?e.aliases??[]:[])].some(s=>s.toLocaleLowerCase(locale).includes(query)));
 }).sort((a,b)=>a.texts[locale]!.name.localeCompare(b.texts[locale]!.name,locale));
}
export function catalogCounts(entries:CatalogEntry[],locale:Lang){
 const visible=entries.filter(e=>e.texts[locale]);
 return Object.fromEntries(Object.entries(groups).map(([g,kinds])=>[g,visible.filter(e=>(kinds as readonly Kind[]).includes(e.kind)).length])) as Record<Group,number>;
}
/** The public artifact is intentionally separate from private import data. Only allowlisted fields reach the browser. */
export function parsePublicCatalog(value:unknown):CatalogEntry[]{
 const obj=(x:unknown):Record<string,unknown>|null=>x!==null&&typeof x==="object"&&!Array.isArray(x)?x as Record<string,unknown>:null;
 const root=obj(value);if(root?.version!==1||!Array.isArray(root.entries))throw new Error("Invalid published catalog");
 const ids=new Set<string>();const entries:CatalogEntry[]=[];
 for(const row of root.entries){
  const e=obj(row),s=obj(e?.source),t=obj(e?.texts);
  const goodText=(x:unknown,max:number):x is string=>typeof x==="string"&&x.trim().length>0&&x.length<=max;
  if(!e||!s||!t||!goodText(e.id,200)||ids.has(e.id)||!allKinds.includes(e.kind as Kind)||!goodText(e.patch,80)||!["live","ptr","historical"].includes(e.channel as string)||!goodText(s.name,200)||!goodText(s.url,2000)||typeof s.reviewedDate!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(s.reviewedDate)||Number.isNaN(Date.parse(s.reviewedDate)))throw new Error("Invalid public catalog entry");
  const url=new URL(s.url);if(url.protocol!=="https:"||url.username||url.password)throw new Error("Invalid provenance URL");
  const texts:CatalogEntry["texts"]={};for(const l of ["tr","en","de"] as const){if(t[l]===undefined)continue;const x=obj(t[l]);if(!x||!goodText(x.name,300)||(x.description!==undefined&&typeof x.description!=="string"))throw new Error("Invalid public locale");texts[l]={name:x.name,description:typeof x.description==="string"?x.description:undefined};}
  if(!Object.keys(texts).length)throw new Error("No reviewed locale in public entry");
  ids.add(e.id);entries.push({id:e.id,kind:e.kind as Kind,patch:e.patch,channel:e.channel as CatalogEntry["channel"],classKey:goodText(e.classKey,200)?e.classKey:undefined,source:{name:s.name,url:url.href,reviewedDate:s.reviewedDate},texts});
 }
 return entries;
}

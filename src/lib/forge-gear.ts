export type ArchiveItem={id:string;name:string;kind:"unique"|"aspect";type:string;classKey:string|null;slotType:string|null;stats:string[];effect:string;bosses:string[];chaos:boolean;icon?:string};
export type ArchiveStat={name:string;slot:string;classKey:string|null};
export type GearArchive={items:ArchiveItem[];stats:ArchiveStat[]};
const text=(v:unknown):string=>typeof v==="string"?v.trim():"";
const list=(v:unknown):string[]=>Array.isArray(v)?v.filter((x):x is string=>typeof x==="string"&&!!x.trim()):[];
const object=(v:unknown):Record<string,unknown>=>v&&typeof v==="object"&&!Array.isArray(v)?v as Record<string,unknown>:{};
const rows=(v:unknown)=>Array.isArray(v)?v.map(object):[];
const key=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const armour:Record<string,string>={helm:"Helm",chest:"Chest Armor",chest_armor:"Chest Armor",gloves:"Gloves",pants:"Pants",boots:"Boots",amulet:"Amulet",ring1:"Ring",ring2:"Ring",ring_1:"Ring",ring_2:"Ring"};
const weapons=new Set(["1h Sword","2h Sword","1h Axe","2h Axe","1h Mace","2h Mace","1h Dagger","1h Scythe","2h Scythe","Staff","Wand","Bow","Crossbow","Quarterstaff","Glaive","Polearm"]);
const offhands=new Set(["Focus","Shield","Totem"]);
export function normalizedSlot(slot:string){return armour[slot]??(slot==="offhand"?"Offhand": ["weapon","extra1","extra2","bludgeoning_weapon","slashing_weapon","dual_wield_weapon_1","dual_wield_weapon_2"].includes(slot)?"Weapon":null)}
export function normalizeArchive(input:unknown,icons:Record<string,string>={}):GearArchive{
 const p=object(object(object(input).result).pageContext), loot=rows(p.lootTables);
 const items:ArchiveItem[]=[];
 for(const [kind,data] of [["unique",p.uniques],["aspect",p.codexes]] as const){
  for(const r of rows(data)){
   const name=text(r.name),type=text(r.type),classKey=key(text(r.class))||null;if(!name||!type)continue;
   const stats=kind==="unique"?[...list(r.secondary_stats),...(list(r.terciary_stats__full).length?list(r.terciary_stats__full):list(r.terciary_stats))]:[];
   const bosses=kind==="unique"?loot.filter(b=>[...list(b.all),...(classKey?list(b[classKey]):[])].includes(name)).map(b=>text(b.boss)).filter(Boolean):[];
   items.push({id:[kind,key(name),classKey??"all",key(type)].join(":"),name,kind,type,classKey,slotType:kind==="aspect"?null:type,stats,effect:text(kind==="aspect"?r.description:r.effect),bosses:[...new Set(bosses)],chaos:r.chaos===true,icon:icons[key(name)]});
  }
 }
 const stats:ArchiveStat[]=[];
 for(const r of rows(p.stats)){const slot=text(r.slot);if(!slot)continue;for(const [k,v] of Object.entries(r)){if(k==="slot")continue;for(const name of list(v))stats.push({name,slot,classKey:k==="all"?null:k});}}
 return {items,stats};
}
/** Never infer an aspect's slot eligibility or a weapon's class-specific hand restrictions. */
export function gearCandidates(archive:GearArchive,slot:string,classKey:string,query="",kind:"unique"|"aspect"|"all"="all"){
 const target=normalizedSlot(slot),q=query.trim().toLowerCase();if(!target)return [];
 return archive.items.filter(e=>(!e.classKey||e.classKey===classKey)&&(kind==="all"||e.kind===kind)&&(!q||[e.name,e.type,...e.stats].some(s=>s.toLowerCase().includes(q)))&&(e.kind==="aspect"||e.slotType===target||(target==="Weapon"&&weapons.has(e.slotType??""))||(target==="Offhand"&&offhands.has(e.slotType??"")))).sort((a,b)=>a.name.localeCompare(b.name));
}
export function statCandidates(archive:GearArchive,slot:string,classKey:string,query=""){
 const target=normalizedSlot(slot),q=query.trim().toLowerCase();if(!target)return [];
 return [...new Set(archive.stats.filter(s=>s.slot===target&&(!s.classKey||s.classKey===classKey)&&s.name.toLowerCase().includes(q)).map(s=>s.name))].sort((a,b)=>a.localeCompare(b));
}
export function exactArchiveItem(archive:GearArchive,name:string,slot:string,classKey:string,kind:"unique"|"aspect"){
 const matches=gearCandidates(archive,slot,classKey,"",kind).filter(e=>e.name.toLowerCase()===name.trim().toLowerCase());return matches.length===1?matches[0]:null;
}
export const emptyArchive:GearArchive={items:[],stats:[]};

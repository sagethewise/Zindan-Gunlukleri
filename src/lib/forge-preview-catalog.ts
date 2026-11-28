import type {CatalogEntry,Kind} from "./forge-catalog";

// Only names already available via the existing anonymous legacy tables.
// No descriptions, stats, private queue records, or inferred patch assignments.
export const referenceTables=[
 {table:"d4_uniques",kind:"item",hasClass:true},
 {table:"d4_unique_variants",kind:"item",hasClass:true},
 {table:"d4_legendary_aspects",kind:"aspect",hasClass:true},
 {table:"d4_skills_tr",kind:"skill",hasClass:true},
 {table:"d4_paragon_boards",kind:"paragon_board",hasClass:true},
 {table:"d4_paragon_glyphs",kind:"glyph",hasClass:true},
 {table:"d4_runes",kind:"rune",hasClass:false},
 {table:"d4_tempering_manuals",kind:"temper_manual",hasClass:true},
] as const satisfies readonly {table:string;kind:Kind;hasClass:boolean}[];
export type ReferenceTable=typeof referenceTables[number];
export const previewEnabled=(environment:string|undefined)=>environment==="preview";
const name=(v:unknown)=>typeof v==="string"?v.trim().slice(0,300):"";
export function referenceEntries(table:ReferenceTable,rows:unknown):CatalogEntry[]{
 if(!Array.isArray(rows))return [];
 const seen=new Set<string>();const result:CatalogEntry[]=[];
 for(const row of rows){
  if(!row||typeof row!=="object")continue;
  const en=name(row.name_en),tr=name(row.name_tr),fallback=en||tr;
  if(!fallback||!(typeof row.id==="string"||typeof row.id==="number"))continue;
  const id="reference:"+table.table+":"+row.id;if(seen.has(id))continue;seen.add(id);
  const classKey=table.hasClass?name(row.class_key).toLowerCase():"";
  result.push({id,kind:table.kind,patch:"Unverified",channel:"historical",
   classKey:classKey||undefined,reference:true,aliases:[en,tr].filter(Boolean),
   source:{name:table.table,url:"",reviewedDate:""},
   texts:{en:{name:en||tr},tr:{name:tr||en},de:{name:en||tr}}});
 }
 return result;
}

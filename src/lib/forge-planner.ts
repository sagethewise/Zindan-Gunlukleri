export const plannerClasses=["barbarian","druid","necromancer","rogue","sorcerer","spiritborn","paladin","warlock"] as const;
export type PlannerClass=typeof plannerClasses[number];
export const slots=["helm","chest","gloves","pants","boots","weapon","offhand","amulet","ring1","ring2","extra1","extra2","seal","charms"] as const;
export type PlannerSlot=typeof slots[number];
export type Gear={item:string;aspect:string;affixes:string;archiveRef?:string;archiveStats?:string[]};
export type Skill={name:string;rank:string};
export type Board={name:string;glyph:string;notes:string};
export type ForgePlan={version:1;id:string;title:string;classId:PlannerClass;season:string;patch:string;mode:"seasonal"|"eternal";gear:Record<PlannerSlot,Gear>;skills:Skill[];boards:Board[];runes:string;mercenary:string;warPlans:string;notes:string;updatedAt:string};
const emptyGear=():Record<PlannerSlot,Gear>=>Object.fromEntries(slots.map(s=>[s,{item:"",aspect:"",affixes:""}])) as Record<PlannerSlot,Gear>;
export function newPlan(id:string):ForgePlan{return {version:1,id,title:"",classId:"barbarian",season:"16",patch:"",mode:"seasonal",gear:emptyGear(),skills:Array.from({length:6},()=>({name:"",rank:""})),boards:[],runes:"",mercenary:"",warPlans:"",notes:"",updatedAt:new Date().toISOString()};}
const str=(v:unknown,max=3000)=>typeof v==="string"?v.slice(0,max):"";
const obj=(v:unknown):Record<string,unknown>=>v&&typeof v==="object"&&!Array.isArray(v)?v as Record<string,unknown>:{};
export function parsePlan(value:unknown):ForgePlan|null{
 const x=obj(value);if(x.version!==1||!plannerClasses.includes(x.classId as PlannerClass)||typeof x.id!=="string"||!x.id||x.id.length>100)return null;
 const p=newPlan(x.id);p.title=str(x.title,120);p.classId=x.classId as PlannerClass;p.season=str(x.season,30);p.patch=str(x.patch,30);p.mode=x.mode==="eternal"?"eternal":"seasonal";
 for(const slot of slots){const g=obj(obj(x.gear)[slot]);p.gear[slot]={item:str(g.item,160),aspect:str(g.aspect,160),affixes:str(g.affixes),...(typeof g.archiveRef==="string"&&g.archiveRef?{archiveRef:str(g.archiveRef,300)}:{}),...(Array.isArray(g.archiveStats)?{archiveStats:g.archiveStats.filter((x):x is string=>typeof x==="string").map(x=>str(x,200)).slice(0,30)}:{})}}
 if(Array.isArray(x.skills))p.skills=Array.from({length:6},(_,i)=>{const s=obj((x.skills as unknown[])[i]);return {name:str(s.name,120),rank:str(s.rank,20)}});
 if(Array.isArray(x.boards))p.boards=x.boards.slice(0,20).map(b=>{const v=obj(b);return {name:str(v.name,120),glyph:str(v.glyph,120),notes:str(v.notes)}});
 p.runes=str(x.runes);p.mercenary=str(x.mercenary);p.warPlans=str(x.warPlans);p.notes=str(x.notes,12000);p.updatedAt=str(x.updatedAt,40)||p.updatedAt;return p;
}

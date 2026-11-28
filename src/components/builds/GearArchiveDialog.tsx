"use client";
import Image from "next/image";
import {useEffect,useRef,useState} from "react";
import {Shield,Sword,Search,X,Plus,Database} from "lucide-react";
import {gearCandidates,statCandidates,exactArchiveItem,emptyArchive,type GearArchive,type ArchiveItem} from "@/lib/forge-gear";
import {gearCopy} from "@/lib/forge-gear-copy";
import type {Locale} from "@/lib/i18n";
let archivePromise:Promise<GearArchive>|null=null;
function loadArchive(){if(!archivePromise)archivePromise=fetch("/api/forge/archive").then(async r=>{if(!r.ok)throw Error("archive");const b=await r.json();if(!b.available||!Array.isArray(b.items)||!Array.isArray(b.stats))throw Error("archive");return {items:b.items,stats:b.stats}}).catch(e=>{archivePromise=null;throw e});return archivePromise}
function GearIcon({item,size=26}:{item:ArchiveItem;size?:number}){return item.icon?<Image src={item.icon} width={size+12} height={size+12} alt="" className="object-contain"/>:item.kind==="unique"?<Shield size={size}/>:<Sword size={size}/>;}
export function ItemDetails({item,locale}:{item:ArchiveItem;locale:Locale}){
 const c=gearCopy[locale];return <div className="fg-details"><div className="fg-item-heading"><div className="fg-item-icon"><GearIcon item={item}/></div><div><h3>{item.name}</h3><p className={item.kind==="unique"?"fg-unique":"fg-aspect"}>{item.kind==="unique"?c.unique:c.aspect} · {item.type}{item.chaos?" · Chaos":""}</p></div></div>
 {item.stats.length>0&&<><h4>{c.range}</h4><ul>{item.stats.map((s,i)=><li key={i}>{s}</li>)}</ul></>}
 {item.effect&&<><h4>{c.effect}</h4><p>{item.effect}</p></>}
 {item.bosses.length>0&&<><h4>{c.boss}</h4><p>{item.bosses.join(", ")}</p></>}
 <small>{c.source}: <a href="https://d4builds.gg/" target="_blank" rel="noreferrer" className="dd-text-link">D4Builds.gg</a> · {c.archive}</small></div>
}
export default function GearArchiveDialog({locale,slot,slotLabel,classKey,assigned,onClose,onPick,onStat,selectedStats=[]}:{locale:Locale;slot:string;slotLabel:string;classKey:string;assigned?:{item?:string;aspect?:string};onClose:()=>void;onPick?:(item:ArchiveItem)=>void;onStat?:(name:string)=>void;selectedStats?:string[]}){
 const c=gearCopy[locale],ref=useRef<HTMLDialogElement>(null),[archive,setArchive]=useState(emptyArchive),[status,setStatus]=useState<"idle"|"loading"|"ready"|"error">("idle"),[tab,setTab]=useState<"items"|"stats">("items"),[query,setQuery]=useState(""),[kind,setKind]=useState<"all"|"unique"|"aspect">("all"),[chosen,setChosen]=useState<ArchiveItem|null>(null),[limit,setLimit]=useState(50);
 useEffect(()=>{ref.current?.showModal();void openArchive();return()=>{ref.current?.close()}},[]);
 async function openArchive(){setStatus("loading");try{const a=await loadArchive();setArchive(a);setStatus("ready");setChosen((assigned?.item&&exactArchiveItem(a,assigned.item,slot,classKey,"unique"))||(assigned?.aspect&&exactArchiveItem(a,assigned.aspect,slot,classKey,"aspect"))||null)}catch{setStatus("error")}}
 const items=gearCandidates(archive,slot,classKey,query,kind),stats=statCandidates(archive,slot,classKey,query);
 return <dialog ref={ref} className="fg-dialog" onCancel={onClose} onClick={e=>{if(e.target===ref.current)onClose()}} aria-label={c.inspect}>
 <div className="fg-dialog-inner"><header className="fg-dialog-header"><div><p className="dd-kicker">DIABLO IV / BUILD FORGE</p><h2>{slotLabel} · {c.inspect}</h2></div><button type="button" onClick={onClose} aria-label={c.close}><X size={22}/></button></header>
 <div className="fg-notice"><strong>{c.archive}</strong><p>{c.archiveDetail}</p>{onPick&&<p>{c.archiveOnly}</p>}</div>
 {status==="idle"||status==="error"?<div className="fg-empty"><Database size={30}/><p>{status==="error"?c.unavailable:c.archiveDetail}</p><button className="dd-button secondary" onClick={()=>void openArchive()}>{c.load}</button></div>:status==="loading"?<p className="fg-empty" role="status">{c.loading}</p>:<>
 <div className="fg-controls"><div className="fg-tabs"><button aria-pressed={tab==="items"} onClick={()=>{setTab("items");setQuery("");setLimit(50)}}>{c.items}</button><button aria-pressed={tab==="stats"} onClick={()=>{setTab("stats");setQuery("");setLimit(50)}}>{c.stats}</button></div>
 <label className="fg-search"><Search size={18}/><input aria-label={c.search} placeholder={c.search} value={query} onChange={e=>{setQuery(e.target.value);setLimit(50)}}/></label></div>
 {tab==="items"?<div className="fg-browser"><div className="fg-list"><div className="fg-kind">{(["all","unique","aspect"] as const).map(k=><button key={k} aria-pressed={kind===k} onClick={()=>{setKind(k);setLimit(50)}}>{c[k]}</button>)}</div><p className="fg-hint">{items.length} {c.results} · {c.unknown}</p>{items.slice(0,limit).map(item=><button type="button" key={item.id} className="fg-row" aria-pressed={chosen?.id===item.id} onClick={()=>setChosen(item)}><span className="fg-item-icon"><GearIcon item={item} size={18}/></span><span><strong>{item.name}</strong><small className={item.kind==="unique"?"fg-unique":"fg-aspect"}>{item.type}{item.chaos?" · Chaos":""}</small></span></button>)}{!items.length&&<p className="fg-hint">{c.noResults}</p>}{items.length>limit&&<button className="dd-button secondary" onClick={()=>setLimit(n=>n+50)}>+ 50</button>}</div><div className="fg-inspector">{chosen?<><ItemDetails item={chosen} locale={locale}/>{onPick?<button type="button" className="dd-button primary" onClick={()=>onPick(chosen)}>{c.select}</button>:<p className="fg-hint">{assigned?.item===chosen.name||assigned?.aspect===chosen.name?c.assigned:c.notAssigned}</p>}</>:<p className="fg-hint">{assigned?.item||assigned?.aspect?c.noDetails:c.empty}</p>}</div></div>:<div className="fg-stat-list"><p className="fg-hint">{stats.length} {c.results} · {c.unknownValue}</p>{stats.slice(0,limit).map(name=><button key={name} className="fg-stat-row" disabled={!onStat||selectedStats.includes(name)} onClick={()=>onStat?.(name)}><span>{name}</span>{onStat&&(selectedStats.includes(name)?<span>✓</span>:<Plus size={17}/>)}</button>)}{!stats.length&&<p className="fg-hint">{c.noResults}</p>}{stats.length>limit&&<button className="dd-button secondary" onClick={()=>setLimit(n=>n+50)}>+ 50</button>}</div>}
 </>}
 </div></dialog>
}

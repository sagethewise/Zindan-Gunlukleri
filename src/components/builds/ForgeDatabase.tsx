"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import ForgeSourceLinks from "./ForgeSourceLinks";
import {Database,Shield,Swords,Network,Gem,ScrollText,Globe,Search,ArrowUpRight} from "lucide-react";
import {groups,allKinds,filterCatalog,catalogCounts,defaultFilter,type Group,type CatalogEntry,type CatalogFilter} from "@/lib/forge-catalog";
import {catalogCopy,groupLabel,kindLabel} from "@/lib/forge-catalog-copy";
import {localizedPath,type Locale} from "@/lib/i18n";
import {plannerClasses} from "@/lib/forge-planner";
import {forgeCopy} from "@/lib/forge-copy";
const icons={equipment:Shield,skills:Swords,paragon:Network,runes:Gem,systems:ScrollText,world:Globe};
export default function ForgeDatabase({locale,entries}:{locale:Locale;entries:CatalogEntry[]}){
 const c=catalogCopy[locale], [filter,setFilter]=useState<CatalogFilter>(defaultFilter),[page,setPage]=useState(1);
 const update=(delta:Partial<CatalogFilter>)=>{setFilter(f=>({...f,...delta}));setPage(1)};
 const visible=useMemo(()=>entries.filter(e=>!!e.texts[locale]),[entries,locale]);
 const counts=useMemo(()=>catalogCounts(entries,locale),[entries,locale]);
 const results=useMemo(()=>filterCatalog(entries,locale,filter),[entries,locale,filter]);
 const kinds=filter.group==="all"?allKinds:groups[filter.group];
 const classes=Array.from(new Set(visible.flatMap(e=>e.classKey?[e.classKey]:[]))).sort();
 const patches=Array.from(new Set(visible.map(e=>e.patch))).sort();
 const className=(k:string)=>{const i=plannerClasses.indexOf(k as typeof plannerClasses[number]);return i<0?k:forgeCopy[locale].classes[i]};
 const totalPages=Math.max(1,Math.ceil(results.length/24));
 return <div className="dd-shell fc">
 <Link href={localizedPath(locale,"forge")} className="dd-text-link">← {c.back}</Link>
 <section className="dd-page-head fc-head"><div><p className="dd-kicker">DIABLO IV / DUNGEON DIARIES</p><h1>{c.title}</h1><p>{c.intro}</p></div><Link href={localizedPath(locale,"forge","planner")} className="dd-button secondary">{c.planner}<ArrowUpRight size={16}/></Link></section>
 {!visible.length&&<div className="fp-warning fc-notice"><Shield size={20}/><div><strong>{c.status}</strong><p>{c.statusBody}</p></div></div>}
 <ForgeSourceLinks locale={locale}/>
 <div className="fc-stats"><div><strong>{visible.length}</strong><span>{c.total}</span></div><div><strong>{Object.keys(groups).length}</strong><span>{c.sections}</span></div><div><strong>{allKinds.length}</strong><span>{c.types}</span></div></div>
 <div className="fc-layout"><aside className="fp-sidebar fc-nav"><h2>{c.sections}</h2><button type="button" aria-pressed={filter.group==="all"} onClick={()=>update({group:"all",kind:"all"})}><Database size={18}/><span>{c.all}</span><small>{visible.length}</small></button>{(Object.keys(groups) as Group[]).map(g=>{const Icon=icons[g];return <button type="button" key={g} aria-pressed={filter.group===g} onClick={()=>update({group:g,kind:"all"})}><Icon size={18}/><span>{groupLabel(g,locale)}</span><small>{counts[g]}</small></button>})}</aside>
 <section className="fp-workspace fc-workspace"><h2>{filter.group==="all"?c.title:groupLabel(filter.group,locale)}</h2>
 <div className="fc-filter"><label className="fp-field fc-search"><span>{c.search}</span><div><Search size={17}/><input value={filter.query} onChange={e=>update({query:e.target.value})} placeholder={c.search}/></div></label>
 <label className="fp-field"><span>{c.type}</span><select value={filter.kind} onChange={e=>update({kind:e.target.value as CatalogFilter["kind"]})}><option value="all">{c.all}</option>{kinds.map(k=><option key={k} value={k}>{kindLabel(k,locale)}</option>)}</select></label>
 <label className="fp-field"><span>{c.patch}</span><select value={filter.patch} onChange={e=>update({patch:e.target.value})}><option value="">{c.all}</option>{patches.map(p=><option key={p}>{p}</option>)}</select></label>
 <label className="fp-field"><span>{c.channel}</span><select value={filter.channel} onChange={e=>update({channel:e.target.value})}><option value="">{c.all}</option>{(["live","ptr","historical"] as const).map(ch=><option key={ch} value={ch}>{c[ch]}</option>)}</select></label>
 <label className="fp-field"><span>{c.class}</span><select value={filter.classKey} onChange={e=>update({classKey:e.target.value})}><option value="">{c.all}</option>{classes.map(k=><option key={k} value={k}>{className(k)}</option>)}</select></label></div>
 <div className="fc-result-head"><span role="status">{results.length} {c.results}</span><button type="button" className="dd-text-link" onClick={()=>{setFilter(defaultFilter);setPage(1)}}>{c.reset}</button></div>
 {results.length?<><div className="fc-results">{results.slice((page-1)*24,page*24).map(e=>{const t=e.texts[locale]!;return <article key={e.id} className="fp-card"><p className="dd-kicker">{kindLabel(e.kind,locale)} · {e.patch} · {c[e.channel]}</p><h3>{t.name}</h3><p>{t.description}</p><small>{e.classKey?className(e.classKey):c.shared}</small><small>{c.source}: <a className="dd-text-link" href={e.source.url} target="_blank" rel="noreferrer">{e.source.name}</a></small><small>{c.review}: {e.source.reviewedDate}</small></article>})}</div><div className="fc-pagination"><button className="dd-button secondary" disabled={page===1} onClick={()=>setPage(p=>p-1)}>{c.prev}</button><span>{c.page} {page}/{totalPages}</span><button className="dd-button secondary" disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)}>{c.next}</button></div></>:<div className="fc-empty"><Database size={38}/><h3>{visible.length?c.empty:c.pending}</h3>{!visible.length&&<p>{c.pendingBody}</p>}</div>}
 <div className="fc-schema"><h3>{c.schema}</h3><div>{kinds.map(k=><span key={k}>{kindLabel(k,locale)}</span>)}</div></div>
 </section></div></div>
}

"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {Search,ArrowUpRight} from "lucide-react";
import {localizedPath,messages,type Locale} from "@/lib/i18n";
import {designText,hubs,hubForGuide} from "@/lib/game-hubs";
import type {Post} from "@/lib/types";
import {guideTranslation} from "@/lib/guide-translations";

export function GuideCards({posts,locale}:{posts:Post[];locale:Locale}){
 const d=designText[locale];
 return <div className="dd-guide-grid">{posts.map(p=>{const t=guideTranslation(p,locale),hub=hubForGuide(p.slug);return <Link key={p.slug} href={localizedPath(locale,"games",p.slug)} className="dd-guide-card group"><div className="dd-guide-image">{p.metadata.coverImage?<Image src={p.metadata.coverImage} alt="" fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500"/>:<div className="dd-image-fallback">DD</div>}<span className="dd-overlay-tag">{hub?.name??d.guideLabel}</span></div><div className="dd-guide-info"><span className="dd-kicker">{new Date(p.metadata.date).toLocaleDateString(locale,{year:"numeric",month:"short",day:"numeric"})}</span><h3>{t.title}</h3><p>{t.summary.replace(/\*\*/g,"")}</p><span className="dd-text-link">{d.read} <ArrowUpRight size={15}/></span></div></Link>})}</div>
}
export default function GuideCatalog({posts,locale,initialHub=""}:{posts:Post[];locale:Locale;initialHub?:string}){
 const [search,setSearch]=useState(""),[filter,setFilter]=useState(initialHub),[sort,setSort]=useState("newest");
 const d=designText[locale],m=messages[locale];
 const filtered=useMemo(()=>posts.filter(p=>{const t=guideTranslation(p,locale);return (!filter||hubForGuide(p.slug)?.id===filter)&& (t.title+" "+t.summary+" "+(p.metadata.tags??[]).join(" ")).toLocaleLowerCase(locale).includes(search.toLocaleLowerCase(locale));}).sort((a,b)=>sort==="newest"?Date.parse(b.metadata.date)-Date.parse(a.metadata.date):Date.parse(a.metadata.date)-Date.parse(b.metadata.date)),[posts,locale,filter,search,sort]);
 return <section className="dd-section"><div className="dd-section-head"><div><p className="dd-kicker">{d.guideLabel}</p><h2>{d.allGuides}</h2></div><span className="dd-kicker">{filtered.length} / {posts.length}</span></div><div className="dd-filter"><label className="dd-search"><Search size={18}/><input aria-label={d.search} placeholder={d.search} value={search} onChange={e=>setSearch(e.target.value)}/></label><select aria-label={d.filter} value={filter} onChange={e=>setFilter(e.target.value)}><option value="">{m.all}</option>{hubs.filter(h=>h.slugs.length).map(h=><option key={h.id} value={h.id}>{h.name}</option>)}</select><select aria-label={d.latest} value={sort} onChange={e=>setSort(e.target.value)}><option value="newest">{d.latest}</option><option value="oldest">{d.oldest}</option></select></div>{filtered.length?<GuideCards posts={filtered} locale={locale}/>:<div className="dd-empty">{d.noResults}</div>}</section>
}

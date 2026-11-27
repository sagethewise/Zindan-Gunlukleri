import Image from "next/image";
import Link from "next/link";
import {ArrowRight,ArrowUpRight,Play,Flame,Compass} from "lucide-react";
import {hubs,designText,type Hub} from "@/lib/game-hubs";
import {localizedPath,messages,type Locale} from "@/lib/i18n";
import {getAllPostsByType} from "@/lib/posts";
import {fetchYouTubeVideos,type VideoItem} from "@/lib/youtube";
import GuideCatalog,{GuideCards} from "./GuideCatalog";
import BrandMark from "./BrandMark";
const youtube="https://www.youtube.com/@gg_asli";
async function getVideos(){return (await Promise.all([fetchYouTubeVideos("DnD"),fetchYouTubeVideos("BG3"),fetchYouTubeVideos("Diablo")])).flat().sort((a,b)=>Date.parse(b.date)-Date.parse(a.date));}
function HubCards({locale}:{locale:Locale}){
 return <div className="dd-hub-grid">{hubs.map(h=><Link key={h.id} href={localizedPath(locale,"games","hub/"+h.id)} className="dd-hub-card group"><Image src={h.image} alt="" fill sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500"/><div className="dd-hub-fade"/><div className="dd-hub-info"><span className="dd-kicker" style={{color:h.accent}}>{h.slugs.length?String(h.slugs.length).padStart(2,"0")+" / "+designText[locale].guideLabel:designText[locale].gameLabel}</span><h3>{h.name}</h3><p>{h.text[locale]}</p><ArrowUpRight size={18}/></div></Link>)}</div>
}
function VideoCards({videos,locale}:{videos:VideoItem[];locale:Locale}){
 const d=designText[locale],m=messages[locale];
 if(!videos.length)return <div className="dd-empty">{m.empty} <a className="dd-text-link" href={youtube} target="_blank" rel="noreferrer">{m.watch} <ArrowUpRight size={15}/></a></div>;
 return <div className="dd-video-grid">{videos.map(v=><a key={v.id} href={"https://www.youtube.com/watch?v="+v.id} target="_blank" rel="noreferrer" className="dd-guide-card group"><div className="dd-guide-image"><Image fill sizes="(max-width:640px) 100vw, 33vw" alt="" src={"https://img.youtube.com/vi/"+v.id+"/hqdefault.jpg"} className="object-cover"/><span className="dd-video-play"><Play size={20} fill="currentColor"/></span></div><div className="dd-guide-info"><span className="dd-kicker">{d.videoLabel} · {v.category}</span><h3>{v.title}</h3></div></a>)}</div>
}
export async function DungeonHome({locale}:{locale:Locale}){
 const d=designText[locale],m=messages[locale]; const posts=getAllPostsByType("oyun");const videos=await getVideos();
 return <div className="dd-shell">
  <section className="dd-hero"><div className="dd-hero-content"><span className="dd-kicker">{d.eyebrow}</span><h1>{d.heroTitle}</h1><p className="dd-hero-line">{d.heroLine}</p><p className="dd-hero-description">{m.intro}</p><div className="dd-actions"><Link className="dd-button primary" href={localizedPath(locale,"games")}>{d.browse}<ArrowRight size={18}/></Link><a className="dd-button secondary" href={youtube} target="_blank" rel="noreferrer"><Play size={16}/>{m.watch}</a></div></div><div className="dd-hero-art" aria-hidden="true"><div className="dd-orbit orbit-one"/><div className="dd-orbit orbit-two"/><div className="dd-orbit orbit-three"/><BrandMark className="dd-hero-mark"/><span className="dd-art-caption">DUNGEON<br/>DIARIES</span></div><div className="dd-hero-index">D / D</div></section>
  <section className="dd-section"><div className="dd-section-head"><div><p className="dd-kicker">01 / {d.gameLabel}</p><h2>{d.hubTitle}</h2><p>{d.hubIntro}</p></div><Link className="dd-text-link" href={localizedPath(locale,"games")}>{d.viewAll} <ArrowRight size={16}/></Link></div><HubCards locale={locale}/></section>
  <section className="dd-tool"><div className="dd-tool-icon"><Flame size={42}/></div><div><p className="dd-kicker">02 / {d.toolsLabel}</p><h2>{m.forge}</h2><p>{d.forgeDesc}</p></div><Link className="dd-button primary" href={localizedPath(locale,"forge")}>{m.forge}<ArrowRight size={18}/></Link></section>
  <section className="dd-section"><div className="dd-section-head"><div><p className="dd-kicker">03 / {d.guideLabel}</p><h2>{d.guides}</h2></div><Link className="dd-text-link" href={localizedPath(locale,"games")}>{d.viewAll}<ArrowRight size={16}/></Link></div><GuideCards posts={posts.slice(0,3)} locale={locale}/></section>
  <section className="dd-section"><div className="dd-section-head"><div><p className="dd-kicker">04 / {d.videoLabel}</p><h2>{d.videos}</h2><p>{d.videoNote}</p></div><Link className="dd-text-link" href={localizedPath(locale,"videos")}>{d.viewAll}<ArrowRight size={16}/></Link></div><VideoCards videos={videos.slice(0,3)} locale={locale}/></section>
  </div>
}
export function GameIndex({locale}:{locale:Locale}){const d=designText[locale];return <div className="dd-shell"><section className="dd-page-head"><p className="dd-kicker">{d.gameLabel} / 07</p><h1>{d.hubTitle}</h1><p>{d.hubIntro}</p></section><HubCards locale={locale}/><GuideCatalog posts={getAllPostsByType("oyun")} locale={locale}/></div>}
export async function GameHub({locale,hub}:{locale:Locale;hub:Hub}){
 const d=designText[locale],m=messages[locale],posts=getAllPostsByType("oyun").filter(p=>(hub.slugs as readonly string[]).includes(p.slug));const videos=hub.category?await fetchYouTubeVideos(hub.category):[];
 return <div className="dd-shell"><Link href={localizedPath(locale,"games")} className="dd-text-link">← {d.back}</Link><section className="dd-hub-hero"><Image src={hub.image} alt="" fill sizes="100vw" className="object-cover"/><div className="dd-hub-fade"/><div className="dd-hub-hero-content"><p className="dd-kicker">{d.gameLabel}</p><h1>{hub.name}</h1><p>{hub.text[locale]}</p>{hub.id==="diablo-iv"&&<Link className="dd-button primary" href={localizedPath(locale,"forge")}>{m.forge}<ArrowRight size={16}/></Link>}</div></section><section className="dd-section"><div className="dd-section-head"><h2>{d.allGuides}</h2></div>{posts.length?<GuideCards posts={posts} locale={locale}/>:<div className="dd-empty"><Compass size={22}/><div><strong>{d.coming}</strong><p>{d.comingDetail}</p></div></div>}</section>{hub.category&&<section className="dd-section"><div className="dd-section-head"><div><h2>{d.videos}</h2><p>{d.videoNote}</p></div></div><VideoCards videos={videos} locale={locale}/></section>}</div>
}

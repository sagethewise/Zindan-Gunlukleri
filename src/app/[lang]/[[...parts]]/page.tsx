import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { localizedPath, messages, type Locale, type Section } from "@/lib/i18n";
import { getAllPostsByType } from "@/lib/posts";
import { getTranslatedContent } from "@/lib/translated-content";
import { markdownToHtml } from "@/lib/markdownToHtml";
import { guideTranslation } from "@/lib/guide-translations";
import { fetchYouTubeVideos } from "@/lib/youtube";
import VideoGalleryClient from "@/components/VideoGalleryClient";
import ContactForm from "@/components/ContactForm";
import BuildFirini from "@/components/builds/BuildFirini";
import { getBuildsBySeason } from "@/lib/builds";
import { CURRENT_D4_SEASON } from "@/lib/constants";
import BuildDetailPage from "@/components/builds/BuildDetailContent";
import {buildText} from "@/lib/build-i18n";
import type { Post } from "@/lib/types";

type Params = Promise<{lang:string;parts?:string[]}>;
const sections:Section[]=["home","games","forge","videos","about","contact"];
function resolve(lang:string,parts:string[]=[]){
  if(lang!=="en" && lang!=="de") notFound();
  const locale:Locale=lang;
  const section=sections.find(s=>localizedPath(locale,s)==="/"+[locale,parts[0]].filter(Boolean).join("/"));
  if(!section) notFound();
  const suffix=parts.slice(1);
  if(suffix.length && !["games","forge"].includes(section)) notFound();
  if(section==="games"&&suffix.length>1)notFound();
  if(section==="forge"&&suffix.length>1&&(suffix.length!==2||suffix[0]!== (locale==="de"?"saison":"season")||!/^\d+$/.test(suffix[1])))notFound();
  return {locale,section,suffix};
}
export async function generateMetadata({params}:{params:Params}):Promise<Metadata>{
  const {lang,parts}=await params;const {locale,section,suffix}=resolve(lang,parts);
  const m=messages[locale];const path=localizedPath(locale,section,suffix.join("/"));
  if(section==="games"&&suffix.length){
    const post=getAllPostsByType("oyun").find(p=>p.slug===suffix[0]);if(!post)notFound();
    const translated=getTranslatedContent(locale,post.slug);
    const languages=Object.fromEntries((["tr","en","de"] as const).filter(l=>l==="tr"||getTranslatedContent(l,post.slug)).map(l=>[l,localizedPath(l,"games",post.slug)]));
    return {title:guideTranslation(post,locale).title+" | Dungeon Diaries",description:guideTranslation(post,locale).summary,robots:{index:!!translated,follow:true},alternates:translated?{canonical:path,languages}:{canonical:localizedPath("tr","games",post.slug)}};
  }
  const languages=Object.fromEntries((["tr","en","de"] as const).map(l=>[l,localizedPath(l,section,suffix.map((s,i)=>section==="forge"&&i===0&&suffix.length===2?(l==="de"?"saison":"season"):s).join("/"))]));
  return {title:section==="home"?"Dungeon Diaries":m[section]+" | Dungeon Diaries",description:m.description,alternates:{canonical:path,languages}};
}
const wrap="max-w-7xl mx-auto px-4 py-10 space-y-8";
function GuideCards({posts,locale}:{posts:Post[];locale:Locale}){
 const m=messages[locale];return <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{posts.map(p=>{const t=guideTranslation(p,locale);return <Link key={p.slug} href={localizedPath(locale,"games",p.slug)} className="rounded-xl overflow-hidden border bg-white hover:shadow-md"><div className="relative aspect-video">{p.metadata.coverImage&&<Image src={p.metadata.coverImage} alt="" fill className="object-cover"/>}</div><div className="p-5 space-y-2"><h2 className="font-semibold text-lg">{t.title}</h2><p className="text-sm text-gray-600">{t.summary}</p><p className="text-xs text-gray-500">{getTranslatedContent(locale,p.slug)?m.read:m.source}</p></div></Link>})}</div>;
}
async function videos(){return (await Promise.all([fetchYouTubeVideos("DnD"),fetchYouTubeVideos("BG3"),fetchYouTubeVideos("Diablo")])).flat().sort((a,b)=>Date.parse(b.date)-Date.parse(a.date));}
export default async function LocalizedPage({params}:{params:Params}){
 const {lang,parts}=await params;const {locale,section,suffix}=resolve(lang,parts);const m=messages[locale];
 if(section==="home")return <main className={wrap}><section className="rounded-2xl bg-gray-900 text-white p-8 md:p-14"><p className="text-sm uppercase tracking-widest text-green-300">Dungeon Diaries</p><h1 className="text-4xl md:text-5xl font-bold mt-3">{m.tagline}</h1><p className="mt-4 max-w-xl text-gray-200">{m.intro}</p><div className="mt-6 flex flex-wrap gap-3"><Link className="bg-white text-gray-900 rounded-lg px-4 py-2 font-semibold" href={localizedPath(locale,"forge")}>{m.forge}</Link><Link className="border border-white rounded-lg px-4 py-2" href={localizedPath(locale,"videos")}>{m.videos}</Link></div></section><h2 className="text-2xl font-bold">{m.latest}</h2><VideoGalleryClient videos={(await videos()).slice(0,5)} locale={locale}/><h2 className="text-2xl font-bold">{m.guides}</h2><GuideCards posts={getAllPostsByType("oyun").slice(0,6)} locale={locale}/></main>;
 if(section==="games"){const posts=getAllPostsByType("oyun");if(!suffix.length)return <main className={wrap}><h1 className="text-4xl font-bold">{m.games}</h1><GuideCards posts={posts} locale={locale}/></main>;const p=posts.find(p=>p.slug===suffix[0]);if(!p)notFound();const t=guideTranslation(p,locale);const translated=getTranslatedContent(locale,p.slug);return <main className="max-w-3xl mx-auto px-4 py-10 space-y-6"><Link href={localizedPath(locale,"games")}>← {m.games}</Link>{p.metadata.coverImage&&<Image src={p.metadata.coverImage} alt="" width={1200} height={630} className="rounded-xl"/>}<h1 className="text-3xl font-bold">{t.title}</h1><p>{t.summary}</p>{translated&&<article className="markdown-body max-w-none" dangerouslySetInnerHTML={{__html:await markdownToHtml(translated)}}/>}<div className="rounded-xl bg-gray-100 p-5">{!translated&&<p>{m.source}</p>}<Link href={localizedPath("tr","games",p.slug)} className="inline-block mt-3 font-semibold text-green-700">{m.original} →</Link></div></main>;}
 if(section==="videos")return <main className={wrap}><h1 className="text-4xl font-bold">{m.videos}</h1><VideoGalleryClient videos={await videos()} locale={locale}/></main>;
 if(section==="about")return <main className="max-w-3xl mx-auto px-4 py-12 space-y-6"><h1 className="text-4xl font-bold">{m.about}</h1><h2 className="text-2xl font-semibold">{m.tagline}</h2><p>{m.intro}</p><p>{locale==="de"?"Wir sind ein Paar, das gerne gemeinsam spielt – von Diablo und World of Warcraft bis Baldur’s Gate und Dungeons & Dragons. Bei uns geht es um Entdecken, Geschichten und Spaß am Spiel, nicht um Wettbewerb.":"We are a couple who enjoy gaming together, from Diablo and World of Warcraft to Baldur’s Gate and Dungeons & Dragons. We focus on exploration, stories and enjoying the game rather than competition."}</p><Link className="inline-block bg-red-600 text-white rounded-lg px-4 py-2" href="https://www.youtube.com/@gg_asli">{m.watch}</Link></main>;
 if(section==="contact")return <main className={wrap}><h1 className="text-4xl font-bold text-center">{m.contact}</h1><p className="text-center">{m.contactIntro}</p><ContactForm locale={locale}/></main>;
 if(section==="forge"){if(suffix.length===1)return <div><p className="max-w-6xl mx-auto px-4 py-3 text-sm text-gray-600">{buildText[locale].data}</p><BuildDetailPage locale={locale} params={Promise.resolve({slug:suffix[0]})}/></div>;const season=suffix.length===2?Number(suffix[1]):CURRENT_D4_SEASON;return <BuildFirini builds={await getBuildsBySeason(season)} season={season} isCurrent={season===CURRENT_D4_SEASON} locale={locale}/>;}
 notFound();
}

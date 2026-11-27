import {notFound} from "next/navigation";
import type {Metadata} from "next";
import {localizedPath,messages,locales,type Locale,type Section} from "@/lib/i18n";
import {getAllPostsByType} from "@/lib/posts";
import {getTranslatedContent} from "@/lib/translated-content";
import {guideTranslation} from "@/lib/guide-translations";
import {findHub} from "@/lib/game-hubs";
import {DungeonHome,GameIndex,GameHub} from "@/components/DungeonExperience";
import {DungeonVideos,DungeonAbout,DungeonContact} from "@/components/DungeonPages";
import GuideReader from "@/components/GuideReader";
import BuildFirini from "@/components/builds/BuildFirini";
import {getBuildsBySeason} from "@/lib/builds";
import {TARGET_D4_SEASON,isKnownSeason} from "@/lib/constants";
import BuildDetailPage from "@/components/builds/BuildDetailContent";
import ForgeDatabasePage from "@/components/builds/ForgeDatabasePage";
import {catalogCopy} from "@/lib/forge-catalog-copy";
import ForgePlanner from "@/components/builds/ForgePlanner";
import {forgeCopy} from "@/lib/forge-copy";
import {buildText} from "@/lib/build-i18n";
type Params=Promise<{lang:string;parts?:string[]}>;
const sections:Section[]=["home","games","forge","videos","about","contact"];
function resolve(lang:string,parts:string[]=[]){
 if(lang!=="en"&&lang!=="de")notFound();
 const locale:Locale=lang;
 const section=sections.find(s=>localizedPath(locale,s)==="/"+[locale,parts[0]].filter(Boolean).join("/"));
 if(!section)notFound();
 const suffix=parts.slice(1);
 if(suffix.length&&!["games","forge"].includes(section))notFound();
 if(section==="games"&&suffix.length>1&&(suffix.length!==2||suffix[0]!=="hub"||!findHub(suffix[1])))notFound();
 if(section==="forge"&&suffix.length>1&&(suffix.length!==2||suffix[0]!==(locale==="de"?"saison":"season")||!/^\d+$/.test(suffix[1])||!isKnownSeason(Number(suffix[1]))))notFound();
 return {locale,section,suffix};
}
export async function generateMetadata({params}:{params:Params}):Promise<Metadata>{
 const {lang,parts}=await params;const {locale,section,suffix}=resolve(lang,parts);const m=messages[locale];const path=localizedPath(locale,section,suffix.join("/"));
 const languages=Object.fromEntries(locales.map(l=>[l,localizedPath(l,section,suffix.map((s,i)=>section==="forge"&&i===0&&suffix.length===2?(l==="de"?"saison":"season"):s).join("/"))]));
 if(section==="games"&&suffix.length===2){const hub=findHub(suffix[1]);if(!hub)notFound();return {title:hub.name+" | Dungeon Diaries",description:hub.text[locale],alternates:{canonical:path,languages}}}
 if(section==="games"&&suffix.length===1){const post=getAllPostsByType("oyun").find(p=>p.slug===suffix[0]);if(!post)notFound();const translated=getTranslatedContent(locale,post.slug);return {title:guideTranslation(post,locale).title+" | Dungeon Diaries",description:guideTranslation(post,locale).summary,robots:{index:!!translated,follow:true},alternates:translated?{canonical:path,languages:Object.fromEntries(locales.filter(l=>l==="tr"||getTranslatedContent(l,post.slug)).map(l=>[l,localizedPath(l,"games",post.slug)]))}:{canonical:localizedPath("tr","games",post.slug)}}}
 if(section==="forge"&&suffix.length===1&&suffix[0]==="database")return {title:catalogCopy[locale].title+" | Dungeon Diaries",description:catalogCopy[locale].intro,robots:{index:false,follow:true},alternates:{canonical:path,languages}};
 return {title:section==="home"?"Dungeon Diaries":(section==="forge"&&suffix[0]==="planner"?forgeCopy[locale].planner:m[section])+" | Dungeon Diaries",description:m.description,alternates:{canonical:path,languages}};
}
export default async function Page({params}:{params:Params}){
 const {lang,parts}=await params;const {locale,section,suffix}=resolve(lang,parts);
 if(section==="home")return <DungeonHome locale={locale}/>;
 if(section==="games"){if(!suffix.length)return <GameIndex locale={locale}/>;if(suffix.length===2){const hub=findHub(suffix[1]);if(!hub)notFound();return <GameHub locale={locale} hub={hub}/>;}const post=getAllPostsByType("oyun").find(p=>p.slug===suffix[0]);if(!post)notFound();return <GuideReader locale={locale} post={post}/>;}
 if(section==="videos")return <DungeonVideos locale={locale}/>;
 if(section==="about")return <DungeonAbout locale={locale}/>;
 if(section==="contact")return <DungeonContact locale={locale}/>;
 if(section==="forge"){if(suffix[0]==="database"&&suffix.length===1)return <ForgeDatabasePage locale={locale}/>;if(suffix[0]==="planner"&&suffix.length===1)return <ForgePlanner locale={locale}/>;if(suffix.length===1)return <div><p className="max-w-6xl mx-auto px-4 py-3 text-sm text-gray-600">{buildText[locale].data}</p><BuildDetailPage locale={locale} params={Promise.resolve({slug:suffix[0]})}/></div>;const season=suffix.length===2?Number(suffix[1]):TARGET_D4_SEASON;return <BuildFirini builds={await getBuildsBySeason(season)} season={season} isCurrent={season===TARGET_D4_SEASON} locale={locale}/>;}
 notFound();
}

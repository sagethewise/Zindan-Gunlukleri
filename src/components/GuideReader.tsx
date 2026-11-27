import Image from "next/image";
import Link from "next/link";
import {localizedPath,type Locale,messages} from "@/lib/i18n";
import {designText,hubForGuide} from "@/lib/game-hubs";
import {getAllPostsByType} from "@/lib/posts";
import {guideTranslation} from "@/lib/guide-translations";
import {getTranslatedContent} from "@/lib/translated-content";
import {markdownToHtml} from "@/lib/markdownToHtml";
import type {Post} from "@/lib/types";
import Questionnaire from "./Questionnairednd";
import GuideReaderNav from "./GuideReaderNav";
import {GuideCards} from "./GuideCatalog";
export default async function GuideReader({post,locale}:{post:Post;locale:Locale}){
 const d=designText[locale],m=messages[locale],hub=hubForGuide(post.slug),t=guideTranslation(post,locale);
 const translated=getTranslatedContent(locale,post.slug);
 const content=locale==="tr"?post.content:translated;
 const html=content?await markdownToHtml(content):"";
 const mins=Math.max(1,Math.ceil((content??"").trim().split(/\s+/).length/220));
 const all=getAllPostsByType("oyun").filter(p=>p.slug!==post.slug);
 const related=all.filter(p=>hub&&hubForGuide(p.slug)?.id===hub.id).concat(all.filter(p=>!hub||hubForGuide(p.slug)?.id!==hub.id)).slice(0,3);
 return <div className="dd-shell"><div className="dd-reader-head"><Link className="dd-text-link" href={localizedPath(locale,"games",hub?"hub/"+hub.id:"")}>← {hub?.name??d.back}</Link><div className="dd-kicker mt-5">{d.guideLabel} · {new Date(post.metadata.date).toLocaleDateString(locale,{year:"numeric",month:"long",day:"numeric"})} · {mins} {d.minutes}</div><h1>{t.title}</h1><p>{t.summary.replace(/\*\*/g,"")}</p>{post.metadata.coverImage&&<div className="dd-reader-cover"><Image fill src={post.metadata.coverImage} alt="" sizes="(max-width:900px) 100vw, 900px" className="object-cover"/></div>}</div>
 <div className="dd-reader-layout"><GuideReaderNav label={d.contents} articleId={post.slug}/><div className="dd-reader-body">{html?<article id="dd-article" className="markdown-body" dangerouslySetInnerHTML={{__html:html}}/>:<p>{m.source}</p>}<Questionnaire locale={locale}/>{locale!=="tr"&&<Link className="dd-text-link" href={localizedPath("tr","games",post.slug)}>{m.original} ↗</Link>}</div></div>
 <section className="dd-section"><div className="dd-section-head"><h2>{d.more}</h2></div><GuideCards posts={related} locale={locale}/></section></div>
}

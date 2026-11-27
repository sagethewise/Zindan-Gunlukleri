import {hubs} from "@/lib/game-hubs";
import type {MetadataRoute} from "next";
import {localizedPath,locales,type Section} from "@/lib/i18n";
import {getAllPostsByType} from "@/lib/posts";
import {getTranslatedContent} from "@/lib/translated-content";
const origin="https://zindangunlukleri.com";
const sections:Section[]=["home","games","forge","videos","about","contact"];
export default function sitemap():MetadataRoute.Sitemap{
 const pages:MetadataRoute.Sitemap=sections.flatMap(section=>locales.map(locale=>({url:origin+localizedPath(locale,section),alternates:{languages:Object.fromEntries(locales.map(l=>[l,origin+localizedPath(l,section)]))}})));
 for(const l of locales)pages.push({url:origin+localizedPath(l,"forge","planner"),alternates:{languages:Object.fromEntries(locales.map(lang=>[lang,origin+localizedPath(lang,"forge","planner")]))}});
 for(const h of hubs)for(const l of locales)pages.push({url:origin+localizedPath(l,"games","hub/"+h.id),alternates:{languages:Object.fromEntries(locales.map(lang=>[lang,origin+localizedPath(lang,"games","hub/"+h.id)]))}});
 for(const p of getAllPostsByType("oyun")){
  const available=locales.filter(l=>l==="tr"||getTranslatedContent(l,p.slug));
  for(const l of available)pages.push({url:origin+localizedPath(l,"games",p.slug),alternates:{languages:Object.fromEntries(available.map(lang=>[lang,origin+localizedPath(lang,"games",p.slug)]))}});
 }
 return pages;
}

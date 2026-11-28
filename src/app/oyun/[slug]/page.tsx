import type {Metadata} from "next";
import {localizedPath,locales} from "@/lib/i18n";
import {getTranslatedContent} from "@/lib/translated-content";
import {getPostBySlug} from "@/lib/posts";
import {notFound} from "next/navigation";
import GuideReader from "@/components/GuideReader";
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;const post=getPostBySlug(slug);if(!post||post.metadata.type!=="oyun")notFound();
 return {...(post.metadata.previewOnly?{robots:{index:false,follow:true}}:{}),title:post.metadata.title+" | Dungeon Diaries",description:post.metadata.summary,alternates:{canonical:localizedPath("tr","games",slug),languages:Object.fromEntries(locales.filter(l=>l==="tr"||getTranslatedContent(l,slug)).map(l=>[l,localizedPath(l,"games",slug)]))}};
}

export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const post=getPostBySlug(slug);if(!post||post.metadata.type!=="oyun")notFound();return <GuideReader post={post} locale="tr"/>;}

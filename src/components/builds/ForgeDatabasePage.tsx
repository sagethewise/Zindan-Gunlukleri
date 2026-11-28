import ForgeDatabase from "./ForgeDatabase";
import catalog from "../../../content/forge/public-catalog.json";
import {parsePublicCatalog} from "@/lib/forge-catalog";
import {previewEnabled,referenceTables,referenceEntries} from "@/lib/forge-preview-catalog";
import type {Locale} from "@/lib/i18n";

export default async function ForgeDatabasePage({locale}:{locale:Locale}){
 const entries=parsePublicCatalog(catalog);
 if(!previewEnabled(process.env.VERCEL_ENV))return <ForgeDatabase locale={locale} entries={entries}/>;
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key)return <ForgeDatabase locale={locale} entries={entries} previewUnavailable/>;
 const batches=await Promise.all(referenceTables.map(async table=>{
  try{
   const endpoint=new URL("/rest/v1/"+table.table,url);
   endpoint.searchParams.set("select","id,name_en,name_tr"+(table.hasClass?",class_key":""));
   endpoint.searchParams.set("order","id.asc");
   endpoint.searchParams.set("limit","1000");
   const response=await fetch(endpoint,{headers:{apikey:key,Authorization:"Bearer "+key},cache:"no-store",signal:AbortSignal.timeout(8000)});
   if(!response.ok)return null;
   return referenceEntries(table,await response.json());
  }catch{return null;}
 }));
 const references=batches.flatMap(rows=>rows??[]);
 return <ForgeDatabase locale={locale} entries={[...entries,...references]} previewUnavailable={!references.length||batches.some(rows=>rows===null)}/>;
}

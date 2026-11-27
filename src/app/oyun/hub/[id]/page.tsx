import {notFound} from "next/navigation";
import {findHub} from "@/lib/game-hubs";
import {GameHub} from "@/components/DungeonExperience";
import {localizedPath,locales} from "@/lib/i18n";
export async function generateMetadata({params}:{params:Promise<{id:string}>}){const {id}=await params;const hub=findHub(id);if(!hub)notFound();return {title:hub.name+" | Dungeon Diaries",description:hub.text.tr,alternates:{canonical:localizedPath("tr","games","hub/"+id),languages:Object.fromEntries(locales.map(l=>[l,localizedPath(l,"games","hub/"+id)]))}}}
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;const hub=findHub(id);if(!hub)notFound();return <GameHub locale="tr" hub={hub}/>}

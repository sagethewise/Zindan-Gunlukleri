import ForgeDatabasePage from "@/components/builds/ForgeDatabasePage";
import {catalogCopy} from "@/lib/forge-catalog-copy";
import {localizedPath,locales} from "@/lib/i18n";
export const metadata={title:catalogCopy.tr.title+" | Dungeon Diaries",description:catalogCopy.tr.intro,robots:{index:false,follow:true},alternates:{canonical:localizedPath("tr","forge","database"),languages:Object.fromEntries(locales.map(l=>[l,localizedPath(l,"forge","database")]))}};
export default function Page(){return <ForgeDatabasePage locale="tr"/>}

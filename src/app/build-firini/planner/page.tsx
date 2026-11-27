import ForgePlanner from "@/components/builds/ForgePlanner";
import {localizedPath,locales} from "@/lib/i18n";
export const metadata={title:"Build Planlayıcı | Dungeon Diaries",alternates:{canonical:localizedPath("tr","forge","planner"),languages:Object.fromEntries(locales.map(l=>[l,localizedPath(l,"forge","planner")]))}};
export default function Page(){return <ForgePlanner locale="tr"/>}

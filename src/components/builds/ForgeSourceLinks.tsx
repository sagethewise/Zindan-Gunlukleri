import {seasonCopy} from "@/lib/forge-season-copy";
import type {Locale} from "@/lib/i18n";
export default function ForgeSourceLinks({locale}:{locale:Locale}){
 const c=seasonCopy[locale];
 return <section className="fp-workspace mb-5"><h2 className="text-lg font-semibold">{c.sources}</h2><p className="text-xs mt-2">{c.sourceNote}</p><div className="grid gap-3 mt-4 sm:grid-cols-2">
 <a href="https://tools.infinitybuilds.gg/en/database" target="_blank" rel="noreferrer" className="dd-text-link">{c.infinity} ↗<small className="block text-stone-600 mt-1">{c.infinityVersion}</small></a>
 <a href="https://infinitybuilds.gg/en" target="_blank" rel="noreferrer" className="dd-text-link">{c.infinityBuilds} ↗</a>
 <a href="https://mobalytics.gg/diablo-4/tier-list" target="_blank" rel="noreferrer" className="dd-text-link">{c.mobalytics} ↗</a>
 <a href="https://d4builds.gg/?var=0" target="_blank" rel="noreferrer" className="dd-text-link">{c.d4builds} ↗</a></div></section>
}

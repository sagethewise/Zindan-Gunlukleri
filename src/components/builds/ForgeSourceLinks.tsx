import {seasonCopy} from "@/lib/forge-season-copy";
import type {Locale} from "@/lib/i18n";
export default function ForgeSourceLinks({locale}:{locale:Locale}){
 const c=seasonCopy[locale];
 const links=[
  {url:"https://tools.infinitybuilds.gg/en/database",name:"InfinityTools",detail:c.infinityVersion},
  {url:"https://infinitybuilds.gg/en",name:"InfinityBuilds",detail:c.infinityBuilds},
  {url:"https://mobalytics.gg/diablo-4/tier-list",name:"Mobalytics",detail:c.mobalytics},
  {url:"https://d4builds.gg/?var=0",name:"D4Builds",detail:c.d4builds}
 ];
 return <aside className="forge-sources-band" aria-label={c.sources}><div className="forge-sources-inner"><div className="forge-sources-heading"><h2>{c.sources}</h2><p>{c.sourceNote}</p></div><nav aria-label={c.sources} className="forge-sources-links">{links.map(link=><a key={link.name} href={link.url} target="_blank" rel="noreferrer" title={link.detail}>{link.name}<span aria-hidden="true">↗</span></a>)}</nav></div></aside>
}

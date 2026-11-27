import Link from "next/link";
import {localizedPath,messages,type Locale} from "@/lib/i18n";
import {designText} from "@/lib/game-hubs";
import {fetchYouTubeVideos} from "@/lib/youtube";
import VideoGalleryClient from "@/components/VideoGalleryClient";
import ContactForm from "@/components/ContactForm";
import TeamSection from "@/components/TeamSection";
import BrandMark from "@/components/BrandMark";
export async function DungeonVideos({locale}:{locale:Locale}){
 const m=messages[locale],d=designText[locale];const videos=(await Promise.all([fetchYouTubeVideos("DnD"),fetchYouTubeVideos("BG3"),fetchYouTubeVideos("Diablo")])).flat();
 return <div className="dd-shell"><section className="dd-page-head"><p className="dd-kicker">{d.videoLabel}</p><h1>{m.videos}</h1><p>{d.videoNote}</p></section><VideoGalleryClient videos={videos} locale={locale}/><Link className="dd-button primary mt-6" href="https://www.youtube.com/@gg_asli" target="_blank" rel="noreferrer">{m.watch} ↗</Link></div>
}
export function DungeonAbout({locale}:{locale:Locale}){const m=messages[locale],d=designText[locale];return <div className="dd-shell"><section className="dd-page-head"><p className="dd-kicker">Dungeon Diaries</p><h1>{m.about}</h1><p>{m.tagline}</p></section><section className="dd-about-panel"><BrandMark className="dd-about-mark"/><div><h2>{d.heroTitle}</h2><p>{d.aboutBody}</p><p>{m.intro}</p><div className="dd-actions"><Link className="dd-button primary" href="https://www.youtube.com/@gg_asli" target="_blank" rel="noreferrer">{m.watch} ↗</Link><Link className="dd-button secondary" href={localizedPath(locale,"contact")}>{m.contact}</Link></div></div></section><section className="dd-section"><TeamSection locale={locale}/></section></div>}
export function DungeonContact({locale}:{locale:Locale}){const m=messages[locale];return <div className="dd-shell"><section className="dd-page-head"><p className="dd-kicker">Dungeon Diaries</p><h1>{m.contact}</h1><p>{m.contactIntro}</p></section><div className="dd-contact"><ContactForm locale={locale}/></div></div>}

"use client";
import BrandMark from "./BrandMark";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {FaInstagram,FaYoutube} from "react-icons/fa";
import {localeFromPath,localizedPath,messages,type Section} from "@/lib/i18n";
const sections:Section[]=["about","games","forge","videos","contact"];
const sourceCopy={
 tr:{heading:"Veri kaynakları ve API’ler",text:"Videolar YouTube API üzerinden alınır. Diablo IV rehberleri Blizzard’ın kamuya açık duyurularına ve belirtilen diğer kaynaklara dayanır. Doğrulanmış ve kullanım izni bulunan oyun verisi API’leri mevcut olduğunda kullanılır; şu anda resmi bir Diablo IV oyun verisi API’si entegre değildir.",disclaimer:"Dungeon Diaries bağımsız bir hayran projesidir; Blizzard Entertainment ile bağlantılı değildir ve onun tarafından desteklenmez. Oyun adları ve ilgili marka hakları sahiplerine aittir.",news:"Blizzard duyuruları"},
 en:{heading:"Data sources & APIs",text:"Videos are retrieved through the YouTube API. Diablo IV guides reference Blizzard’s public announcements and other identified sources. Verified and authorized game-data APIs are used when available; no official Diablo IV game-data API is currently integrated.",disclaimer:"Dungeon Diaries is an independent fan project and is not affiliated with or endorsed by Blizzard Entertainment. Game names and related trademarks belong to their respective owners.",news:"Blizzard announcements"},
 de:{heading:"Datenquellen & APIs",text:"Videos werden über die YouTube-API abgerufen. Diablo-IV-Guides beziehen sich auf öffentliche Ankündigungen von Blizzard und weitere angegebene Quellen. Verifizierte und autorisierte Spieldaten-APIs werden genutzt, sofern verfügbar; derzeit ist keine offizielle Diablo-IV-Spieldaten-API integriert.",disclaimer:"Dungeon Diaries ist ein unabhängiges Fanprojekt und steht weder in Verbindung mit Blizzard Entertainment noch wird es von Blizzard unterstützt. Spielenamen und zugehörige Marken gehören ihren jeweiligen Inhabern.",news:"Blizzard-Ankündigungen"}
} as const;
export default function Footer(){
  const locale=localeFromPath(usePathname()); const m=messages[locale]; const sources=sourceCopy[locale];
  return <footer className="dd-footer">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between gap-8">
      <div><p className="dd-brand"><BrandMark className="dd-brand-icon"/>Dungeon Diaries</p><p className="mt-2">{m.tagline}</p></div>
      <div><p className="font-semibold mb-3">{m.explore}</p><div className="flex flex-wrap gap-4">{sections.map(s=><Link key={s} href={localizedPath(locale,s)} className="hover:text-amber-300">{m[s]}</Link>)}</div></div>
      <div><p className="font-semibold mb-3">{m.follow}</p><div className="flex gap-4 text-xl"><Link aria-label="Instagram" href="https://www.instagram.com/zindan_gunlukleri/" target="_blank" rel="noopener noreferrer"><FaInstagram/></Link><Link aria-label="YouTube" href="https://www.youtube.com/@gg_asli" target="_blank" rel="noopener noreferrer"><FaYoutube/></Link></div></div>
    </div><section className="max-w-6xl mx-auto mt-9 pt-5 border-t border-white/15 text-xs leading-relaxed text-gray-300" aria-label={sources.heading}><h2 className="text-sm font-semibold text-gray-100 mb-2">{sources.heading}</h2><p className="max-w-4xl">{sources.text}</p><p className="mt-2 max-w-4xl">{sources.disclaimer}</p><a href="https://news.blizzard.com/en-us/diablo4" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 underline hover:text-amber-300">{sources.news} ↗</a></section><div className="mt-6 text-center text-xs text-gray-400">© {new Date().getFullYear()} Dungeon Diaries. {m.rights}</div>
  </footer>;
}

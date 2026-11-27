"use client";
import BrandMark from "./BrandMark";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {FaInstagram,FaYoutube} from "react-icons/fa";
import {localeFromPath,localizedPath,messages,type Section} from "@/lib/i18n";
const sections:Section[]=["about","games","forge","videos","contact"];
export default function Footer(){
  const locale=localeFromPath(usePathname()); const m=messages[locale];
  return <footer className="dd-footer">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between gap-8">
      <div><p className="dd-brand"><BrandMark className="dd-brand-icon"/>Dungeon Diaries</p><p className="mt-2">{m.tagline}</p></div>
      <div><p className="font-semibold mb-3">{m.explore}</p><div className="flex flex-wrap gap-4">{sections.map(s=><Link key={s} href={localizedPath(locale,s)} className="hover:text-amber-300">{m[s]}</Link>)}</div></div>
      <div><p className="font-semibold mb-3">{m.follow}</p><div className="flex gap-4 text-xl"><Link aria-label="Instagram" href="https://www.instagram.com/zindan_gunlukleri/" target="_blank" rel="noopener noreferrer"><FaInstagram/></Link><Link aria-label="YouTube" href="https://www.youtube.com/@gg_asli" target="_blank" rel="noopener noreferrer"><FaYoutube/></Link></div></div>
    </div><div className="mt-10 text-center text-xs text-gray-400">© {new Date().getFullYear()} Dungeon Diaries. {m.rights}</div>
  </footer>;
}

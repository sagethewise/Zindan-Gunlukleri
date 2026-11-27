"use client";
import { useState } from "react";
import Link from "next/link";
import BrandMark from "./BrandMark";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { localeFromPath, localizedPath, switchLocale, messages, locales, type Section } from "@/lib/i18n";
const sections: Section[] = ["home","games","forge","videos","about","contact"];
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const m = messages[locale];
  const links = sections.map(section => <Link key={section} href={localizedPath(locale,section)} onClick={()=>setMenuOpen(false)} className={`dd-nav-link ${pathname===localizedPath(locale,section)||section!=="home"&&pathname.startsWith(localizedPath(locale,section)+"/")?"active":""}`}>{m[section]}</Link>);
  const languages = <nav aria-label={m.language} className="dd-lang">{locales.map(l=><a key={l} href={switchLocale(pathname,l)} hrefLang={l} lang={l} aria-current={l===locale?"true":undefined} onClick={()=>setMenuOpen(false)} className={l===locale?"active":""}>{l.toUpperCase()}</a>)}</nav>;
  return <header className="dd-header sticky top-0 z-50"><div className="dd-header-inner">
    <Link href={localizedPath(locale)} className="dd-brand"><BrandMark className="dd-brand-icon"/><span>Dungeon<span className="dd-brand-accent">Diaries</span><small>{locale==="tr"?"OYUN GÜNLÜĞÜ":locale==="de"?"SPIELETAGEBUCH":"GAMING JOURNAL"}</small></span></Link>
    <nav className="hidden lg:flex items-center gap-4 text-sm font-medium">{links}</nav>
    <div className="hidden lg:block">{languages}</div>
    <button onClick={()=>setMenuOpen(v=>!v)} aria-label={m.menu} aria-expanded={menuOpen} className="lg:hidden">{menuOpen?<X/>:<Menu/>}</button>
  </div>{menuOpen&&<div className="dd-mobile-nav lg:hidden border-t px-4 py-4 flex flex-col gap-2">{links}{languages}</div>}</header>;
}

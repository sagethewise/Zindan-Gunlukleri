"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { localeFromPath, localizedPath, switchLocale, messages, locales, type Section } from "@/lib/i18n";
const sections: Section[] = ["home","games","forge","videos","about","contact"];
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const m = messages[locale];
  const links = sections.map(section => <Link key={section} href={localizedPath(locale,section)} onClick={()=>setMenuOpen(false)} className="py-2 text-gray-700 hover:text-green-700">{m[section]}</Link>);
  const languages = <nav aria-label={m.language} className="flex gap-1 rounded-lg border border-gray-200 p-1">{locales.map(l=><a key={l} href={switchLocale(pathname,l)} hrefLang={l} lang={l} aria-current={l===locale?"true":undefined} onClick={()=>setMenuOpen(false)} className={`rounded px-2 py-1 text-xs font-semibold ${l===locale?"bg-gray-900 text-white":"text-gray-600 hover:bg-gray-100"}`}>{l.toUpperCase()}</a>)}</nav>;
  return <header className="bg-white shadow-sm sticky top-0 z-50"><div className="mx-auto max-w-screen-xl px-4 py-3 flex items-center justify-between gap-4">
    <Link href={localizedPath(locale)} className="flex items-center gap-2 shrink-0"><Image src="/logo.svg" alt="" width={32} height={32}/><span className="font-bold text-lg text-gray-900">Dungeon Diaries</span></Link>
    <nav className="hidden lg:flex items-center gap-4 text-sm font-medium">{links}</nav>
    <div className="hidden lg:block">{languages}</div>
    <button onClick={()=>setMenuOpen(v=>!v)} aria-label={m.menu} aria-expanded={menuOpen} className="lg:hidden">{menuOpen?<X/>:<Menu/>}</button>
  </div>{menuOpen&&<div className="lg:hidden border-t px-4 py-4 flex flex-col gap-2">{links}{languages}</div>}</header>;
}

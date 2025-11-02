// src/components/Header.tsx

"use client"; // Bu komponentin bir İstemci Komponenti olduğunu belirtiyoruz.

import { useState } from "react"; // useEffect import edildi
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";


const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  


  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="w-full md:max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Zindan Günlükleri" width={32} height={32} />
            <span className="font-bold text-lg text-gray-900">Zindan Günlükleri</span>
          </Link>
        </div>

        {/* Desktop Menü ve Sağ Taraf Butonlar */}
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex space-x-6 text-sm md:text-base font-medium">
            <Link href="/" className="text-gray-700 hover:text-green-600">Anasayfa</Link>
            <Link href="/oyun" className="text-gray-700 hover:text-green-600">Oyun</Link>
            {/*  <Link href="/builds" className="text-gray-700 hover:text-green-600">Diablo Builds</Link>*/}
            <Link href="/videolar" className="text-gray-700 hover:text-green-600">Video</Link>
            <Link href="/gundem" className="text-gray-700 hover:text-green-600">Gündem</Link>
            <Link href="/about" className="text-gray-700 hover:text-green-600">Hakkımızda</Link>
            <Link href="/contact" className="text-gray-700 hover:text-green-600">İletişim</Link>

          </nav>
          
        </div>
        
        {/* Hamburger menu (mobil) */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu Toggle">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobil Menü */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-2">
          <Link href="/" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 hover:text-green-600">Anasayfa</Link>
          <Link href="/oyun" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 hover:text-green-600">Oyun</Link>
          {/*<Link href="/builds" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 hover:text-green-600">Diablo Builds</Link>*/}
          <Link href="/gundem" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 hover:text-green-600">Gündem</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 hover:text-green-600">Hakkımızda</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 hover:text-green-600">İletişim</Link>
          <Link href="/videolar" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 hover:text-green-600">Video</Link>
        

        </div>
      )}
    </header>
  );
};

export default Header;
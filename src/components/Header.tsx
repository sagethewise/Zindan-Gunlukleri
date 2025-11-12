"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="mx-auto w-full max-w-screen-xl px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Zindan Günlükleri" width={32} height={32} />
            <span className="font-bold text-lg text-gray-900">Zindan Günlükleri</span>
          </Link>
        </div>

        {/* Desktop menü */}
        <nav className="hidden md:flex items-center gap-6 text-sm md:text-base font-medium">
          <Link href="/" className="text-gray-700 hover:text-green-600">Anasayfa</Link>
          <Link href="/oyun" className="text-gray-700 hover:text-green-600">Oyun</Link>
          <Link href="/videolar" className="text-gray-700 hover:text-green-600">Video</Link>
          <Link href="/gundem" className="text-gray-700 hover:text-green-600">Gündem</Link>
          <Link href="/about" className="text-gray-700 hover:text-green-600">Hakkımızda</Link>
          <Link href="/contact" className="text-gray-700 hover:text-green-600">İletişim</Link>
        </nav>

        {/* Mobil hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menüyü aç/kapat"
          className="md:hidden"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobil menü */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-2">
          <Link href="/" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 hover:text-green-600">Anasayfa</Link>
          <Link href="/oyun" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 hover:text-green-600">Oyun</Link>
          <Link href="/videolar" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 hover:text-green-600">Video</Link>
          <Link href="/gundem" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 hover:text-green-600">Gündem</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 hover:text-green-600">Hakkımızda</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 hover:text-green-600">İletişim</Link>
        </div>
      )}
    </header>
  );
};

export default Header;

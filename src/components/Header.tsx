"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react"; // Menü ikonları için

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Image src="/logo.svg" alt="Pheonix Logo" width={32} height={32} />
          <span className="font-bold text-lg text-gray-800">Zindan Günlükleri</span>
        </div>

        {/* Hamburger menu (mobil) */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu Toggle">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Menü */}
        <nav className="hidden md:flex space-x-6 text-sm md:text-base font-medium">
          <Link href="/" className="text-gray-700 hover:text-green-600">Anasayfa</Link>
          <Link href="/blog" className="text-gray-700 hover:text-green-600">Oyun</Link>
          <Link href="/gundem" className="text-gray-700 hover:text-green-600">Gündem</Link>
          <Link href="/about" className="text-gray-700 hover:text-green-600">Hakkımızda</Link>
          <Link href="/contact" className="text-gray-700 hover:text-green-600">İletişim</Link>
        </nav>
      </div>

      {/* Mobil Menü */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 pb-4 space-y-2">
          <Link href="/" onClick={() => setMenuOpen(false)} className="block text-gray-700 hover:text-green-600">Anasayfa</Link>
          <Link href="/blog" onClick={() => setMenuOpen(false)} className="block text-gray-700 hover:text-green-600">Oyun</Link>
          <Link href="/gundem" onClick={() => setMenuOpen(false)} className="block text-gray-700 hover:text-green-600">Gündem</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="block text-gray-700 hover:text-green-600">Hakkımızda</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} className="block text-gray-700 hover:text-green-600">İletişim</Link>
        </div>
      )}
    </header>
  );
};

export default Header;

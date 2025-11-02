// src/components/Header.tsx

"use client"; // Bu komponentin bir İstemci Komponenti olduğunu belirtiyoruz.

import { useState, useEffect } from "react"; // useEffect import edildi
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

// GÜNCELLEME: İstemci tarafı için gerekli import'lar eklendi
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Session } from '@supabase/supabase-js';
import LogoutButton from './LogoutButton';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  // GÜNCELLEME: Oturum bilgisini tutacak state
  const [session, setSession] = useState<Session | null>(null);

  // GÜNCELLEME: useEffect ile oturum bilgisini alıyoruz
  useEffect(() => {
    const supabase = createClientComponentClient();
    
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    getSession();

    // Oturum durumundaki değişiklikleri dinle (giriş/çıkış yapıldığında anında güncelle)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    // Komponent kaldırıldığında listener'ı temizle
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

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
            <Link href="/videolar" className="text-gray-700 hover:text-green-600">Video</Link>
            <Link href="/gundem" className="text-gray-700 hover:text-green-600">Gündem</Link>
            <Link href="/about" className="text-gray-700 hover:text-green-600">Hakkımızda</Link>
            <Link href="/contact" className="text-gray-700 hover:text-green-600">İletişim</Link>
            <Link href="/tier-list" className="text-gray-700 hover:text-green-600">Tier List</Link>
          </nav>
          {/* GÜNCELLEME: Masaüstü için Giriş/Çıkış alanı */}
          <div className="flex items-center gap-x-4 border-l pl-6 border-gray-200">
            {session ? (
              <>
                <span className="text-sm text-gray-500">{session.user.email}</span>
                <LogoutButton />
              </>
            ) : (
              <Link href="/login" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Giriş Yap
              </Link>
            )}
          </div>
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
          <Link href="/gundem" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 hover:text-green-600">Gündem</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 hover:text-green-600">Hakkımızda</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 hover:text-green-600">İletişim</Link>
          <Link href="/videolar" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 hover:text-green-600">Video</Link>
          <Link href="/tier-list" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 hover:text-green-600">Tier List</Link>
          <div className="border-t pt-4 mt-2">
            {/* GÜNCELLEME: Mobil menü için Giriş/Çıkış alanı */}
            {session ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{session.user.email}</span>
                <LogoutButton />
              </div>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)} className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Giriş Yap
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from "next/image";

const Header = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="flex justify-between items-center px-6 py-4 shadow-md bg-white sticky top-0 z-50">
      <div>
        <Image
          src="/logo.svg"
          alt="Pheonix Logo"
          width={32}
          height={32}
          className="mr-2"
        />
      </div>
      <nav className="space-x-6 text-sm md:text-base font-medium">
        <Link href="/" className="text-gray-700 hover:text-green-600">Anasayfa</Link>
        <Link href="/blog" className="text-gray-700 hover:text-green-600">Oyun</Link>
        <Link href="/gundem" className="text-gray-700 hover:text-green-600">Gündem</Link>
        <Link href="/about" className="text-gray-700 hover:text-green-600">Hakkımızda</Link>
        <Link href="/contact" className="text-gray-700 hover:text-green-600">İletişim</Link>
      </nav>
    </header>
  );
};

export default Header;

"use client";

import Link from "next/link";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import { SiBluesky } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="mt-24 bg-gray-50 border-t border-gray-200 py-10 px-6 text-sm text-gray-600">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-start justify-between gap-8">
        {/* 📘 Explore */}
        <div className="flex flex-col gap-3">
          <label htmlFor="explore" className="font-semibold text-brand text-base">
            Explore
          </label>
          <div className="flex flex-col md:flex-row md:gap-8 text-gray-500">
            <Link href="/about" className="hover:text-brand transition">
              Hakkımızda
            </Link>
            <Link href="/blog" className="hover:text-brand transition">
              Oyun
            </Link>
            <Link href="/gundem" className="hover:text-brand transition">
              Gündem
            </Link>
          </div>
        </div>

           {/* 🌍 Socials */}
        <div className="flex flex-col gap-3">
          <label htmlFor="socials" className="font-semibold text-brand text-base">
            Follow us
          </label>
          <div className="flex gap-4 text-xl text-gray-500">
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand"
            >
              <FaInstagram />
            </Link>
            <Link
              href="https://www.youtube.com/@gg_asli"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand"
            >
              <FaYoutube />
            </Link>
            <Link
              href="https://bsky.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand"
            >
              <SiBluesky />
            </Link>
          </div>
        </div>
      </div>

      {/* 🧼 Bottom */}
      <div className="mt-10 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Pheonix. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

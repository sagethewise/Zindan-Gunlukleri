"use client";

import Link from "next/link";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import { SiBluesky } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="mt-24 bg-gray-50 border-t border-gray-200 py-10 px-6 text-sm text-gray-600">

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* 📘 Section: Links */}
        <div className="flex flex-col gap-3">
        <label htmlFor="email" className="font-semibold text-brand text-base">
    Explore
  </label>

        <div className="flex gap-8 text-gray-500">
          <Link href="/about" className="hover:text-brand transition">
            Hakkımızda
          </Link>
          <Link href="/blog" className="hover:text-brand transition">
            Oyun
          </Link>
          <Link href="/gundem" className="hover:text-brand transition">
            Gündem
          </Link>
          <Link href="/contact" className="text-gray-700 dark:text-gray-200 hover:text-green-600">İletişim</Link>

        </div>
        </div>
       {/* 🧾 Section: Newsletter */}
{/*<div className="flex flex-col gap-3">
  <label htmlFor="email" className="font-semibold text-brand text-base">
    Stay Updated
  </label>

  <form
  action="https://formsubmit.co/asliggiray@outlook.com"
  method="POST"
  className="flex flex-col sm:flex-row sm:items-center gap-3 w-full"
>
  <input
    type="email"
    name="email"
    placeholder="Your email"
    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
    required
  />

 
  <input type="hidden" name="_captcha" value="false" />
  <input type="hidden" name="_next" value="https://zindangunlukleri.com/teşekkürler" />

  <button
    type="submit"
    className="w-full sm:w-auto px-4 py-2 bg-brand text-green-600 rounded-md hover:bg-brand-dark transition"
  >
    Subscribe
  </button>
  <input type="hidden" name="_next" value="https://zindangunlukleri.com/teşekkürler" />

</form>

</div>*/}
        {/* 🌍 Section: Socials */}
        <div className="flex flex-col gap-3">
  <label htmlFor="email" className="font-semibold text-brand text-base">
    Follow us
  </label>
        <div className="flex gap-4 text-gray-500">
          <div className="flex gap-4 mt-1 text-xl text-gray-500">
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
      </div>
      {/* 🧼 Bottom */}
      <div className="mt-10 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Pheonix. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;

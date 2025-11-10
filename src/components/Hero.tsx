"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CLASS_KEYS, CLASS_LABEL } from "@/constants/classes";
import Link from "next/link";

export default function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/?q=${encodeURIComponent(query)}`);
  };


  return (
<section className="text-center rounded-2xl py-10 bg-[#1b1f25] shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
  <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow">
    🔥 BuildFırını
  </h1>
  <p className="text-sm md:text-base text-[#BAC2CF] mt-2">
    En iyi Diablo IV yapıları burada şekilleniyor.
  </p>

      {/* Arama */}
      <form
        onSubmit={onSubmit}
        className="flex justify-center mb-8 max-w-md mx-auto"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ara: Barbar, Whirlwind, Sezon 6..."
          className="flex-1 px-4 py-3 rounded-l-lg text-gray-200 focus:outline-none"
        />
        <button
          type="submit"
          className="px-5 py-3 bg-firin-ember text-gray-200 font-semibold rounded-r-lg hover:bg-firin-red transition"
        >
          Ara
        </button>
      </form>

      {/* Sınıflar */}
<div className="mt-6 flex flex-wrap justify-center gap-3">
  {CLASS_KEYS.map((c) => (
    <Link
      key={c}
      href={`/builds?class_key=${c}`}
      className="rounded-md bg-[#2A2F36] text-white/90 px-4 py-2 text-sm hover:bg-[#343b44] transition"
    >
      {CLASS_LABEL[c]}
    </Link>
  ))}
</div>
    </section>
  );
}

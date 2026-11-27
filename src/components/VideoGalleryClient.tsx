"use client";

import { useMemo, useState } from "react";
import { VideoItem } from "@/lib/youtube";
import VideoGrid from "./VideoGrid";
import { messages, type Locale } from "@/lib/i18n";

export default function VideoGalleryClient({ videos, locale="tr" }: { videos: VideoItem[]; locale?:Locale }) {
  const m=messages[locale];
  const [activeCategory, setActiveCategory] = useState<null | string>("Hepsi");
  const [search, setSearch] = useState("");

  const allCategories = ["Hepsi", ...Array.from(new Set(videos.map((v) => v.category)))];

  const filtered = useMemo(() => {
    return videos
      .filter((v) => {
        const matchesCategory = activeCategory === "Hepsi" || v.category === activeCategory;
        const matchesSearch = v.title.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [videos, activeCategory, search]);

  return (
    <>
      {/* 🔒 Sticky filtre bar */}
      <div className="dd-video-filters">
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
          {/* Kategori filtreleri */}
          <div className="flex flex-wrap justify-center gap-2">
            {allCategories.map((cat, i) => (
              <button
                key={`cat-${cat === "Hepsi" ? m.all : cat}-${i}`}
                onClick={() => setActiveCategory(cat === activeCategory ? "Hepsi" : cat)}
                className={`px-4 py-1 text-sm font-medium rounded-full transition ${
                  cat === activeCategory
                    ? "bg-[#304c3a] text-white"
                    : "bg-white text-gray-800 hover:bg-stone-100"
                }`}
              >
                {cat === "Hepsi" ? m.all : cat}
              </button>
            ))}
          </div>

          {/* Arama kutusu */}
          <div className="flex justify-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label={m.search} placeholder={m.search}
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      </div>

      {/* 🎬 Video grid */}
      {filtered.length ? <VideoGrid videos={filtered} locale={locale} /> : <p className="text-sm text-gray-600">{m.empty}</p>}
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import { VideoItem } from "@/lib/youtube";
import VideoGrid from "./VideoGrid";

export default function VideoGalleryClient({ videos }: { videos: VideoItem[] }) {
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
      <div className="mb-4 sticky top-[76px] z-30 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
          {/* Kategori filtreleri */}
          <div className="flex flex-wrap justify-center gap-2">
            {allCategories.map((cat, i) => (
              <button
                key={`cat-${cat}-${i}`}
                onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                className={`px-4 py-1 text-sm font-medium rounded-full transition ${
                  cat === activeCategory
                    ? "bg-green-700 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-green-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Arama kutusu */}
          <div className="flex justify-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Başlıkta ara..."
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      </div>

      {/* 🎬 Video grid */}
      <VideoGrid videos={filtered} />
    </>
  );
}

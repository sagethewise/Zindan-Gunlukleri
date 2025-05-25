"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaPlay } from "react-icons/fa";
import { VideoItem } from "@/lib/youtube";

const isNew = (dateStr: string) => {
  const days = (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24);
  return days <= 3;
};

const categories = ["Hepsi", "DnD", "BG3", "Diablo"];

export default function YouTubeShowcase({ videos }: { videos: VideoItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState("Hepsi");

const filtered: VideoItem[] = [...videos]
  .filter((v) =>
    selectedCategory === "Hepsi" ? true : v.category === selectedCategory
  )
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


  const featured = filtered.slice(0, 2);
  const rest = filtered.slice(2, 5); // sağdaki küçük liste için 4 video

  return (
    <section className="py-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">🎧 Maceraları İzle</h2>
          <p className="text-sm text-gray-500">Son bölümleri aşağıdan izleyebilirsin</p>
        </div>
        <Link
          href="/videolar"
          className="text-sm text-red-600 font-semibold hover:underline"
        >
          Tümünü Gör →
        </Link>
      </div>

      {/* Kategori filtresi */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1 text-sm rounded-full border transition ${
              selectedCategory === cat
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sol: Kartlar */}
        <div className="grid sm:grid-cols-2 gap-4 flex-1">
          {featured.map((video) => (
            <Link
              key={video.id}
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              className="relative rounded-xl overflow-hidden group aspect-video shadow-md hover:shadow-lg transition"
            >
              {/* Yeni etiketi */}
              {isNew(video.date) && (
                <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full z-20 shadow">
                  Yeni
                </span>
              )}

              <Image
                src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                alt={video.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />

              <div className="absolute inset-0 bg-black/50 p-4 flex flex-col justify-end">
                <div className="flex gap-2 mb-2">
                  <span className="bg-white text-xs text-gray-900 px-2 py-0.5 rounded-full">
                    {video.category}
                  </span>
                  <span className="bg-red-600 text-xs text-white px-2 py-0.5 rounded-full">
                    YouTube
                  </span>
                </div>
                <h3 className="text-white text-sm font-semibold line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-gray-200 text-xs line-clamp-2">
                  {video.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Sağ: Başlık listesi */}
        <div className="flex flex-col gap-3 w-full md:w-80 shrink-0">
          {rest.map((video) => (
            <Link
              href={`https://www.youtube.com/watch?v=${video.id}`}
              key={video.id}
              target="_blank"
              className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-gray-900 shadow hover:shadow-md transition"
            >
              <Image
                src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                alt={video.title}
                width={56}
                height={56}
                className="rounded-md object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 dark:text-white line-clamp-1">
                  {video.title}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                  {video.description}
                </p>
              </div>
              <FaPlay className="text-gray-500 dark:text-white text-sm" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { Post } from "@/lib/types";
import { FaCalendarAlt } from "react-icons/fa";

export default function OyunShowcase({ posts }: { posts: Post[] }) {
  const oyunPosts = [...posts]
    .filter((post) => post.metadata.type === "oyun")
    .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());

  const featured = oyunPosts.slice(0, 2); // sol kartlar
  const rest = oyunPosts.slice(2, 6);     // sağ liste

  return (
    <section className="py-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">🎮 Oyun Rehberleri</h2>
          <p className="text-sm text-gray-500">
            FRP sistemleri, BG3 ve D&D içerikleri burada.
          </p>
        </div>
        <Link
          href="/oyun"
          className="text-sm text-purple-900 font-semibold hover:underline"
        >
          Tümünü Gör →
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sol: Kartlar */}
<div className="grid sm:grid-cols-2 gap-4 flex-1">
  {featured.map((post) => (
    <Link
      key={post.slug}
      href={`/oyun/${post.slug}`}
      className="relative rounded-xl overflow-hidden group aspect-video shadow-md hover:shadow-lg transition"
    >
      <Image
        src={post.metadata.coverImage || "/images/default.jpg"}
        alt={post.metadata.title}
        fill
        className="object-cover group-hover:scale-105 transition-transform"
      />

      <div className="absolute inset-0 bg-black/50 p-4 flex flex-col justify-end">
        <div className="flex gap-2 mb-2 flex-wrap">
          {(post.metadata.tags ?? []).slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="bg-white text-xs text-gray-900 px-2 py-0.5 rounded-full"
            >
              #{tag}
            </span>
          ))}
          <span className="bg-green-600 text-xs text-white px-2 py-0.5 rounded-full">
            Oyun
          </span>
        </div>
        <h3 className="text-white text-sm font-semibold line-clamp-2">
          {post.metadata.title}
        </h3>
        <p className="text-gray-200 text-xs line-clamp-2">
          {post.metadata.summary}
        </p>
      </div>
    </Link>
  ))}
</div>

        {/* Sağ: Başlık listesi */}
        <div className="flex flex-col gap-3 w-full md:w-80 shrink-0">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/oyun/${post.slug}`}
              className="flex items-center gap-3 p-3 rounded-lg bg-purple-100 shadow hover:shadow-md transition"
            >
              {post.metadata.coverImage && (
                <Image
                  src={post.metadata.coverImage}
                  alt={post.metadata.title}
                  width={56}
                  height={56}
                  className="rounded-md object-cover"
                />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-purple-950 line-clamp-1">
                  {post.metadata.title}
                </p>
                <p className="text-xs text-purple-900 line-clamp-1">
                  {post.metadata.summary}
                </p>
              </div>
              <FaCalendarAlt className="text-gray-400  text-sm" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

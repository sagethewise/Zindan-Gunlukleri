"use client";

import Link from "next/link";
import { Post } from "@/lib/types";
import { FaCalendarAlt } from "react-icons/fa";

export default function OyunShowcase({ posts }: { posts: Post[] }) {
  const oyunPosts = [...posts]
    .filter((post) => post.metadata.type === "oyun") // type kontrolü
    .sort(
      (a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
    )
    .slice(0, 6);

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
          href="/blog"
          className="text-sm text-green-600 font-semibold hover:underline"
        >
          Tümünü Gör →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {oyunPosts.map((post: Post) => (
          <Link
            key={post.slug}
            href={`/oyun/${post.slug}`}
            className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow hover:shadow-md transition flex flex-col"
          >
            <div className="p-3 flex flex-col gap-1">
              <div className="flex gap-2 mb-1">
                {(post.metadata.tags ?? []).slice(0, 2).map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-gray-200 text-gray-800 text-[10px] px-2 py-0.5 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <h3 className="text-[13px] font-medium text-gray-900 dark:text-white line-clamp-2 leading-tight">
                {post.metadata.title}
              </h3>
              <p className="text-[11px] text-gray-500 flex items-center gap-1">
                <FaCalendarAlt className="text-[10px]" />
                {new Date(post.metadata.date).toLocaleDateString("tr-TR", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="text-[11px] text-gray-500 line-clamp-2">
                {post.metadata.summary}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

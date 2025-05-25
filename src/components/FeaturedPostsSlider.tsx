"use client";

import { Post } from "@/lib/types";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import Link from "next/link";

export default function FeaturedPostsSlider({ posts }: { posts: Post[] }) {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 1.2,
      spacing: 16,
    },
  });

  return (
    <section className="py-6">
      <h2 className="text-2xl font-bold mb-4">⭐ Öne Çıkan Yazılar</h2>
      <div ref={sliderRef} className="keen-slider">
        {posts.map((post) => (
          <div key={post.slug} className="keen-slider__slide bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden group">
            <Link href={`/blog/${post.slug}`} className="block">
              <div className="relative w-full h-48">
                <Image
                  src={post.metadata.coverImage || "/images/default.jpg"}
                  alt={post.metadata.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-500">{post.metadata.category}</p>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                  {post.metadata.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                  {post.metadata.summary}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

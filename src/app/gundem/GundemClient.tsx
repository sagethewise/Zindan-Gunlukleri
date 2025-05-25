"use client";

import { useState } from 'react';
import { Post } from '@/lib/types';
import BlogCard from '@/components/BlogCard';
import { AnimatePresence, motion } from 'framer-motion';
import Image from "next/image";

export default function GundemClient({ posts }: { posts: Post[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const allTags = Array.from(new Set(posts.flatMap(p => p.metadata.tags ?? [])));
  const allCategories = Array.from(new Set(posts.map(p => p.metadata.category)));

  const filteredPosts = posts
    .filter((post) => {
      const tagMatch = activeTag ? post.metadata.tags?.includes(activeTag) : true;
      const categoryMatch = activeCategory ? post.metadata.category === activeCategory : true;
      return tagMatch && categoryMatch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.metadata.date).getTime();
      const dateB = new Date(b.metadata.date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  return (
    <main className="px-4 py-8 max-w-7xl mx-auto grid gap-6">
      {/* 🖼️ Banner */}
     
     
      <section className="relative w-full rounded-lg overflow-hidden mb-2">
      <Image
          src="/images/gündem.png"
          alt="Blog Banner"
          width={1440}
          height={600}
          priority
          className="object-cover object-center"
        /> 
        <h1 className="text-4xl font-bold mt-6 text-white"> Gündem</h1>
        </section>

      {/* Filters */}
      <div className="mb-2 sticky top-[76px] z-30 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="mb-2 flex flex-wrap justify-center gap-2">
            {allCategories.map((cat, index) => (
              <button
                key={`cat-${cat}-${index}`}
                onClick={() => setActiveCategory(cat === activeCategory ? null : (cat ?? null))}
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
          <div className="flex flex-wrap justify-center gap-2">
            {allTags.map((tag, index) => (
              <button
                key={`tag-${tag}-${index}`}
                onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                className={`px-3 py-1 text-sm rounded-full border transition ${
                  tag === activeTag
                    ? "bg-green-600 text-white"
                    : "border-gray-300 text-gray-600 hover:bg-green-50"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* View + Sort controls */}
      <div className="flex justify-end px-4 mb-2">
        <div className="w-full max-w-7xl">
          <div className="flex justify-end">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
              className="text-sm px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
            >
              <option value="newest">🆕 En Yeni</option>
              <option value="oldest">📜 En Eski</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        {visiblePosts.length > 0 && (
          <motion.div
            key={`${activeCategory}-${activeTag}-${sortOrder}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {visiblePosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Load More */}
      {visibleCount < filteredPosts.length && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setVisibleCount(visibleCount + 6)}
            className="bg-brand text-white px-6 py-2 rounded-md hover:bg-brand-dark transition"
          >
            Daha Fazla Yükle
          </button>
        </div>
      )}
    </main>
  );
}

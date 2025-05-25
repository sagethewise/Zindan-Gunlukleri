'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/lib/types';
import { motion } from 'framer-motion';
import { ClockIcon } from '@heroicons/react/16/solid';

interface BlogCardProps {
  post: Post;
  index?: number;
  className?: string;
}

const BlogCard = ({ post, index = 0, className = '' }: BlogCardProps) => {
  const linkPrefix = post.metadata.type === 'gundem' ? 'gundem' : 'oyun';

  return (
    <motion.article
      whileHover={{ scale: 1.015 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col ${className}`}
    >
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={post.metadata.coverImage || '/images/default.jpg'}
          alt={post.metadata.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2 text-xs text-gray-500">
          <span className="bg-green-50 text-green-700 font-medium px-2 py-0.5 rounded-md uppercase tracking-wide text-[11px]">
            {post.metadata.category}
          </span>
          <div className="flex items-center gap-1">
            <ClockIcon className="h-4 w-4 text-gray-400" />
            <span>{post.metadata.readingTime}</span>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {post.metadata.title}
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
          {post.metadata.summary}
        </p>

        <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
          {post.metadata.tags?.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-auto">
          <Link
            href={`/${linkPrefix}/${post.slug}`}
            className="text-sm text-green-700 font-medium hover:underline"
          >
            Devamını oku →
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default React.memo(BlogCard);

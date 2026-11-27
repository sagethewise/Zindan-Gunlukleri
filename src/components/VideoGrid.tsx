"use client";

import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { VideoItem } from "@/lib/youtube";
import { FaCalendarAlt } from "react-icons/fa";

export default function VideoGrid({ videos, locale="tr" }: { videos: VideoItem[]; locale?:Locale }) {
  return (
    <div className="dd-video-grid">
      {videos.map((video) => (
        <Link
          key={video.id}
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          className="dd-guide-card"
        >
          <div className="dd-guide-image">
            <Image
              src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
              alt={video.title}
              fill
              sizes="(max-width:640px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
          <div className="dd-guide-info">
            <div className="flex gap-2 mb-1">
              <span className="bg-gray-200 text-gray-900 text-[10px] px-2 py-0.5 rounded-full">
                {video.category}
              </span>
              <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                YouTube
              </span>
            </div>
<h3 className="line-clamp-2">
  {video.title}
</h3>
            <p className="text-[11px] text-gray-500 flex items-center gap-1">
              <FaCalendarAlt className="text-[10px]" />
              {new Date(video.date).toLocaleDateString(locale, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>

          </div>
        </Link>
      ))}
    </div>
  );
}

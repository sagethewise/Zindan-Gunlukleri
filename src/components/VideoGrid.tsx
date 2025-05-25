"use client";

import Image from "next/image";
import Link from "next/link";
import { VideoItem } from "@/lib/youtube";
import { FaCalendarAlt, FaEye, FaComment, FaShare } from "react-icons/fa";

export default function VideoGrid({ videos }: { videos: VideoItem[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {videos.map((video) => (
        <Link
          key={video.id}
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          className="bg-green-100 rounded-lg overflow-hidden shadow hover:shadow-md transition flex flex-col"
        >
          <div className="relative w-full aspect-video">
            <Image
              src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
              alt={video.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-3 flex flex-col gap-1">
            <div className="flex gap-2 mb-1">
              <span className="bg-gray-200 text-gray-800 text-[10px] px-2 py-0.5 rounded-full">
                {video.category}
              </span>
              <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                YouTube
              </span>
            </div>
<h3 className="text-[13px] font-medium text-green-900 line-clamp-2 leading-tight">
  {video.title}
</h3>
            <p className="text-[11px] text-gray-500 flex items-center gap-1">
              <FaCalendarAlt className="text-[10px]" />
              {new Date(video.date).toLocaleDateString("tr-TR", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
            <div className="flex gap-3 text-[11px] text-gray-400 mt-1">
              <span className="flex items-center gap-1"><FaEye /> 0</span>
              <span className="flex items-center gap-1"><FaComment /> 0</span>
              <span className="flex items-center gap-1"><FaShare /> 0</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

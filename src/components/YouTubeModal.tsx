"use client";

import { useState } from "react";

export default function YouTubeModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-8 text-center">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-md transition"
      >
        🎬 Tanıtım Videosunu İzle
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="relative bg-black rounded-lg overflow-hidden w-full max-w-3xl aspect-video">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1"
              title="Zindan Günlükleri - Tanıtım"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>

            <button
              className="absolute top-2 right-2 text-white text-2xl"
              onClick={() => setIsOpen(false)}
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

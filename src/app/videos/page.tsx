'use client';

import React from 'react';

export default function VideosPage() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-brand">YouTube Videos</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Example Embed */}
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Example Video"
            loading="lazy"
            allowFullScreen
            className="w-full h-full rounded-xl border border-gray-200"
          />
        </div>
      </div>
    </div>
  );
}

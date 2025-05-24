// components/layout/YouTubeEmbed.tsx

export default function YouTubeEmbed() {
    return (
      <div className="relative w-full aspect-video mt-8 rounded-md overflow-hidden shadow-lg">
      <iframe
        className="absolute inset-0 w-full h-full"
        src="https://www.youtube.com/embed/ljeATVVOLNY?si=Eq6MmF9a3LVFJ6j6"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
    );
  }
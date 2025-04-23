// components/layout/YouTubeEmbed.tsx

export default function YouTubeEmbed() {
    return (
      <div className="w-full aspect-video mt-8 rounded-md overflow-hidden shadow-lg">
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/erUjaCm86sY"
          title="Zindan Günlükleri - Tanıtım"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  }
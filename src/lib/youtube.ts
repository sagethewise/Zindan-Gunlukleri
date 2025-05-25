export type VideoItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: "DnD" | "BG3" | "Diablo";
};

type YouTubePlaylistResponse = {
  items: Array<{
    snippet: {
      title: string;
      description: string;
      publishedAt: string;
      resourceId: {
        videoId: string;
      };
    };
  }>;
};

export async function fetchYouTubeVideos(
  category: "DnD" | "BG3" | "Diablo"
): Promise<VideoItem[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  const playlistMap: Record<"DnD" | "BG3" | "Diablo", string> = {
    DnD: process.env.YOUTUBE_PLAYLIST_DND || "",
    BG3: process.env.YOUTUBE_PLAYLIST_BG3 || "",
    Diablo: process.env.YOUTUBE_PLAYLIST_DIABLO || "",
  };

  const playlistId = playlistMap[category];

  // 🧪 Debug log (build sırasında da görünsün)
  console.log("🧪 ENV CHECK", {
    category,
    apiKeyExists: Boolean(apiKey),
    playlistIdExists: Boolean(playlistId),
    playlistId,
    nodeEnv: process.env.NODE_ENV,
  });

  if (!apiKey || !playlistId) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("❌ YouTube API key veya playlist ID eksik.");
    }
    console.warn("⚠️ Geliştirme ortamı: Eksik API bilgileri. Boş liste dönülüyor.");
    return [];
  }

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=${playlistId}&key=${apiKey}`
  );

  if (!res.ok) {
    console.error("YouTube API isteği başarısız:", res.status);
    throw new Error("YouTube API isteği başarısız.");
  }

  const data: YouTubePlaylistResponse = await res.json();

  return data.items.map((item) => ({
    id: item.snippet.resourceId.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    date: item.snippet.publishedAt,
    category,
  }));
}

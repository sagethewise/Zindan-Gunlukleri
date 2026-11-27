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

  if (!apiKey || !playlistId) {
    console.warn("YouTube configuration missing for category:", category);
    return [];
  }

  try {
    const query = new URLSearchParams({
      part: "snippet",
      maxResults: "10",
      playlistId,
      key: apiKey,
    });
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?${query}`,
      { next: { revalidate: 3600 }, signal: AbortSignal.timeout(10000) }
    );

    if (!res.ok) {
      console.warn("YouTube API unavailable:", category, res.status);
      return [];
    }

    const data: YouTubePlaylistResponse = await res.json();
    return data.items
      .filter((item) => Boolean(item.snippet?.resourceId?.videoId))
      .map((item) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        date: item.snippet.publishedAt,
        category,
      }));
  } catch {
    console.warn("YouTube videos temporarily unavailable:", category);
    return [];
  }
}

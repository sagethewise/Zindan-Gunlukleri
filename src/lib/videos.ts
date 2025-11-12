export type VideoItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: "DnD" | "BG3" | "Diablo";
};

type PlaylistItemsResponse = {
  items: Array<{
    contentDetails: { videoId: string };
    snippet?: { publishedAt?: string };
  }>;
  nextPageToken?: string;
};

type VideosListResponse = {
  items: Array<{
    id: string;
    snippet: {
      title: string;
      description: string;
      publishedAt: string;
      liveBroadcastContent?: "none" | "upcoming" | "live";
    };
    status: { privacyStatus: "public" | "unlisted" | "private" };
  }>;
};

const YT_API = "https://www.googleapis.com/youtube/v3";

/**
 * Playlist’ten ID’leri alır → videoların status/snippet bilgilerini çeker →
 * yalnızca PUBLIC olanları döndürür.
 * Mevcut imzayı korur.
 */
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

  // Geliştirme ortamında env eksikse boş dön (ana yapıyı bozmayalım)
  if (!apiKey || !playlistId) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("YouTube API key veya playlist ID eksik.");
    }
    console.warn("YouTube env eksik → boş liste dönülüyor.");
    return [];
  }

  // 1) Playlist’ten video ID’leri (50’şer sayfa)
  const videoIds: string[] = [];
  let pageToken: string | undefined;

  do {
    const url = new URL(`${YT_API}/playlistItems`);
    url.searchParams.set("part", "contentDetails,snippet");
    url.searchParams.set("playlistId", playlistId);
    url.searchParams.set("maxResults", "50");
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    url.searchParams.set("key", apiKey);

    const res = await fetch(url.toString(), { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`playlistItems.list failed: ${res.status}`);

    const data: PlaylistItemsResponse = await res.json();
    videoIds.push(
      ...(data.items ?? []).map((it) => it.contentDetails.videoId).filter(Boolean)
    );
    pageToken = data.nextPageToken;
  } while (pageToken);

  if (videoIds.length === 0) return [];

  // 2) videos.list ile status/snippet çek → sadece PUBLIC filtrele
  const chunks: string[][] = [];
  for (let i = 0; i < videoIds.length; i += 50) {
    chunks.push(videoIds.slice(i, i + 50));
  }

  const collected: VideosListResponse["items"] = [];

  for (const chunk of chunks) {
    const url = new URL(`${YT_API}/videos`);
    url.searchParams.set("part", "status,snippet");
    url.searchParams.set("id", chunk.join(","));
    url.searchParams.set("key", apiKey);

    const res = await fetch(url.toString(), { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`videos.list failed: ${res.status}`);

    const data: VideosListResponse = await res.json();
    collected.push(...(data.items ?? []));
  }

  // 3) Sadece herkese açık + canlı olmayan (opsiyonel) videolar
  const publicOnly = collected.filter(
    (v) =>
      v.status?.privacyStatus === "public" &&
      (v.snippet?.liveBroadcastContent ?? "none") === "none"
  );

  // 4) Mevcut tipine map’le ve tarihe göre sırala (en yeni üstte)
  const result: VideoItem[] = publicOnly
    .map((v) => ({
      id: v.id,
      title: v.snippet.title,
      description: v.snippet.description,
      date: v.snippet.publishedAt,
      category,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));

  return result;
}

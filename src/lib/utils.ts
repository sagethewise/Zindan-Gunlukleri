// lib/utils.ts

export function extractYouTubeId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname;

    if (
      host === "www.youtube.com" ||
      host === "youtube.com" ||
      host === "m.youtube.com"
    ) {
      return parsedUrl.searchParams.get("v");
    }

    if (host === "youtu.be") {
      return parsedUrl.pathname.split("/")[1];
    }

    return null;
  } catch (e) {
    return null;
  }
}

// lib/utils.ts

export function extractYouTubeId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace(/^www\./, ""); // normalize host

    if (
      host === "youtube.com" ||
      host === "m.youtube.com"
    ) {
      return parsedUrl.searchParams.get("v");
    }

    if (host === "youtu.be") {
      const parts = parsedUrl.pathname.split("/").filter(Boolean);
      return parts[0] || null;
    }

    return null;
  } catch {
    return null;
  }
}

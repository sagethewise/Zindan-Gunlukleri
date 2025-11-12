import { fetchYouTubeVideos } from "@/lib/youtube";
import VideoGalleryClient from "@/components/VideoGalleryClient"; // yeni bileşen
import Image from "next/image";

export default async function VideosPage() {
  const dnd = await fetchYouTubeVideos("DnD");
  const bg3 = await fetchYouTubeVideos("BG3");
  const diablo = await fetchYouTubeVideos("Diablo");

  const allVideos = [...dnd, ...bg3, ...diablo];

  return (
    <main className="px-4 py-8 max-w-7xl mx-auto grid gap-6">
<section className="relative w-full rounded-lg overflow-hidden mb-2">
      <Image
          src="/images/video.png"
          alt="Blog Banner"
          width={1440}
          height={600}
          priority
          className="object-cover object-center"
        /> 
        <h1 className="text-4xl font-bold mt-6 text-green-400"> Videolar</h1>
        
      </section>

      {/* Arama + Filtreleme + Grid */}
      <VideoGalleryClient videos={allVideos} />
    </main>
  );
}

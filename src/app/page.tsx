import { fetchYouTubeVideos } from "@/lib/youtube";
import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
import YouTubeShowcase from "@/components/YouTubeShowcase";
import FooterBanner from "@/components/FooterBanner";
import OyunShowcase from "@/components/OyunShowcase";
import { getAllPosts } from "@/lib/posts";


export default async function HomePage() {
  const dnd = await fetchYouTubeVideos("DnD");
  const bg3 = await fetchYouTubeVideos("BG3");
  const diablo = await fetchYouTubeVideos("Diablo");

  const allVideos = [...dnd, ...bg3, ...diablo]; // ✅ Tüm kategoriler birleşti

const posts = getAllPosts();
const oyunPosts = posts.filter((post) => post.metadata.type === "oyun");


  return (
    <main className="px-4 py-8 max-w-7xl mx-auto grid gap-6">
      <HeroBanner />
      <section className="rounded-xl bg-gray-900 text-white p-6 md:p-9"><h1 className="text-3xl font-bold">Dungeon Diaries</h1><p className="mt-2 text-gray-200">İki oyuncu. Sonsuz macera.</p><Link href="/build-firini" className="mt-4 inline-block rounded-lg bg-white px-4 py-2 font-semibold text-gray-900">Build Fırını →</Link></section>
      <YouTubeShowcase videos={allVideos} />
       <OyunShowcase posts={oyunPosts} />

        <FooterBanner />
    </main>
  );
}

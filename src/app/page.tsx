import { fetchYouTubeVideos } from "@/lib/youtube";
import HeroBanner from "@/components/HeroBanner";
import YouTubeShowcase from "@/components/YouTubeShowcase";
import FooterBanner from "@/components/FooterBanner";
import OyunShowcase from "@/components/OyunShowcase";
import { getAllPosts } from "@/lib/posts";
import GundemShowcase from "@/components/GundemShowcase";

export default async function HomePage() {
  const dnd = await fetchYouTubeVideos("DnD");
  const bg3 = await fetchYouTubeVideos("BG3");
  const diablo = await fetchYouTubeVideos("Diablo");

  const allVideos = [...dnd, ...bg3, ...diablo]; // ✅ Tüm kategoriler birleşti

const posts = getAllPosts();
const allPosts = getAllPosts();
const oyunPosts = posts.filter((post) => post.metadata.type === "oyun");
const gundemPosts = allPosts.filter((post) => post.metadata.type === "gundem");

  return (
    <main className="px-4 py-8 max-w-7xl mx-auto grid gap-6">
      <HeroBanner />
      <YouTubeShowcase videos={allVideos} />
       <OyunShowcase posts={oyunPosts} />
<GundemShowcase posts={gundemPosts} />
        <FooterBanner />
    </main>
  );
}

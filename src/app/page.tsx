import { getAllPosts } from '@/lib/posts';
import LatestSlider from '@/components/LatestSlider';
import { Post } from '@/lib/types';

export const revalidate = 60; // 60 saniyede bir revalidate et

export default async function HomePage() {
  const posts: Post[] = getAllPosts(); // çünkü local dosyadan synchronous geliyor

  const featuredPosts = posts
    .filter((post) => post.metadata.featured)
    .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime())
    .slice(0, 5);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* 🖼️ Banner Section */}
      <section className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-2">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/homepage.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-white/20 to-transparent backdrop-sm z-10" />
      </section>

      {/* ⭐ Featured Slider */}
      <section className="relative z-20">
        <LatestSlider posts={featuredPosts} />
      </section>
    </main>
  );
}

import { getAllPosts } from '@/lib/posts';
import LatestSlider from '@/components/LatestSlider';
import { Post } from '@/lib/types';
import Image from "next/image";

export const revalidate = 60; // 60 saniyede bir revalidate et

export default async function HomePage() {
  const posts: Post[] = getAllPosts(); // çünkü local dosyadan synchronous geliyor

  const featuredPosts = posts
    .filter((post) => post.metadata.featured)
    .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime())
    .slice(0, 5);

  return (
    <main className="px-4 py-8 max-w-7xl mx-auto grid gap-6">
      {/* 🖼️ Banner Section */}
      <section className="relative w-full rounded-lg overflow-hidden mb-2">
       <Image
           src="/images/homepage.png"
           alt="Blog Banner"
           width={1440}
           height={600}
           priority
           className="object-cover object-center"
         /></section>

      {/* ⭐ Featured Slider */}
      <section className="relative z-20">
        <LatestSlider posts={featuredPosts} />
      </section>
    </main>
  );
}

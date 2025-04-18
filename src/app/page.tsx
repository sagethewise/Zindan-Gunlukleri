import { getAllPosts } from '@/lib/posts'; // oyun içerikleri
import LatestSlider from '@/components/LatestSlider';


export default function HomePage() {
  const allPosts = getAllPosts(); // Artık oyun + gündem birlikte

  const featuredPosts = allPosts
    .filter((post) => post.metadata.featured)
    .sort(
      (a, b) =>
        new Date(b.metadata.date).getTime() -
        new Date(a.metadata.date).getTime()
    )
    .slice(0, 5);
    console.log("🧾 Tüm Postlar:", allPosts.map(p => ({
      title: p.metadata.title,
      featured: p.metadata.featured
    })));
  return (
    <main className="px-4 py-8 max-w-7xl mx-auto grid gap-6">
            {/* 🖼️ Banner Section */}
    <section className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-12">
  {/* Background image */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: "url('/images/homepage.jpg')" }}
  />

  {/* Dark overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-white/20 to-transparent backdrop-sm z-10" />

</section>
      {/* Featured Slider */}
      <LatestSlider posts={featuredPosts} />
    </main>
  );
}

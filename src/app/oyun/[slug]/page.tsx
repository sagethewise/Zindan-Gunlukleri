import Image from "next/image";
import { getPostBySlug, getRelatedPostsByType } from "@/lib/posts";
import { markdownToHtml } from "@/lib/markdownToHtml";
import { notFound } from "next/navigation";
import Link from "next/link";
import Questionnairednd from "@/components/Questionnairednd";
import StickyToc from "@/components/StickyToc";
import OtherPostsList from "@/components/OtherPostsList";
import type { Post } from "@/lib/types";
import ScrollBox from "@/components/ScrollBox";
import BackToTop from "@/components/BackToTop";
import MobileTocBar from "@/components/MobileTocBar";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = getPostBySlug(slug) as Post | null;
  if (!post) return notFound();

  const contentHtml = await markdownToHtml(post.content);

  const otherPosts = getRelatedPostsByType(
    "oyun",
    slug,
    Array.isArray(post.metadata.tags) ? post.metadata.tags : [],
    10
  );

  return (
    <main className="mx-auto px-4 lg:px-6 xl:px-8 py-16 max-w-screen-xl overflow-x-hidden">
      <Link href="/oyun" className="text-sm text-green-600 hover:underline mb-6 inline-block">
        ← Oyun Sayfasına Dön
      </Link>

      {/* xl ve üstü: 3 sütun | altı: 1 sütun */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Sol: TOC (desktop) */}
        <aside className="hidden xl:block xl:col-span-3 sticky top-12 self-start">
          <ScrollBox title="İçindekiler">
            <StickyToc />
          </ScrollBox>
        </aside>

        {/* Orta */}
        <section className="xl:col-span-6 w-full max-w-[980px] 2xl:max-w-[1040px] mx-auto">
          {post.metadata.coverImage && (
            <Image
              src={post.metadata.coverImage}
              alt={post.metadata.title}
              width={1400}
              height={700}
              className="rounded-xl mb-6 object-cover w-full h-auto max-w-full"
              priority
            />
          )}

          <h1 className="text-4xl font-bold text-green-700 mb-2 leading-tight">
            {post.metadata.title}
          </h1>

          <p className="text-gray-500 mb-2">
            {post.metadata.date ? new Date(post.metadata.date).toLocaleDateString("tr-TR") : null}
            {post.metadata.readingTime ? ` · ${post.metadata.readingTime}` : ""}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {post.metadata.tags?.map((tag) => (
              <span key={tag} className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          {/* Mobil/Tablet: sticky TOC bar (desktop'ta gizli) */}
<MobileTocBar />

          <article className="markdown-body max-w-none leading-relaxed [&>*+*]:mt-6">
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </article>

          <div className="mt-12">
            <Questionnairednd />
          </div>
        </section>

        {/* Sağ: Diğer Yazılar (desktop) */}
        <aside className="hidden xl:block xl:col-span-3 sticky top-12 self-start">
          <ScrollBox title="Diğer Yazılar">
            <OtherPostsList posts={otherPosts} currentSlug={slug} />
          </ScrollBox>
        </aside>
      </div>

      <BackToTop threshold={400} />
    </main>
  );
}

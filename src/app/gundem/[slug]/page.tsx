import { getPostBySlug } from '@/lib/posts';
import { markdownToHtml } from '@/lib/markdownToHtml';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from "next/image";


export default async function GundemPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) return notFound();

  const contentHtml = await markdownToHtml(post.content);

  return (
    <main className="max-w-3xl mx-auto px-6 py-20">
        <Link href="/blog" className="text-sm text-green-600 hover:underline mb-6 inline-block">
    ← Blog&apos;a Dön
  </Link>
      {post.metadata.coverImage && (
        <Image
          src={post.metadata.coverImage}
          alt={post.metadata.title}
          width={800}
          height={400}
          className="rounded-xl mb-6 object-cover"
        />
      )}
            <h1 className="text-4xl font-bold text-green-700 mb-2">{post.metadata.title}</h1>
      <p className="text-gray-500 mb-2">
        {new Date(post.metadata.date).toLocaleDateString("tr-TR")} · {post.metadata.readingTime}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {post.metadata.tags?.map((tag: string) => (
          <span key={tag} className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full">{tag}</span>
        ))}
      </div>
    <article className="markdown-body max-w-3xl mx-auto px-6 py-12">
    
      <div dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </article>
    </main>
  );
}

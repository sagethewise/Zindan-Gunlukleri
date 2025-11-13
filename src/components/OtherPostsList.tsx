// Server Component
import Link from "next/link";
import Image from "next/image";

type PostMeta = {
  title: string;
  date?: string;
  coverImage?: string;
  tags?: string[];
  readingTime?: string;
};

type PostItem = {
  slug: string;
  metadata: PostMeta;
};

export default function OtherPostsList({
  posts = [],
  currentSlug,
}: {
  posts?: PostItem[];
  currentSlug: string;
  title?: string;
}) {
  if (!posts || posts.length === 0) {
    return (
      <div className="sticky top-24 h-fit">
        
        <p className="text-sm text-gray-500">Benzer içerik bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="sticky top-24 h-fit">
      
      <ul className="space-y-4">
        {posts.map((p) => {
          const isActive = p.slug === currentSlug;

          const CardInner = (
            <>
              {p.metadata.coverImage ? (
                <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded-lg border">
                  <Image
                    src={p.metadata.coverImage}
                    alt={p.metadata.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 shrink-0 rounded-lg border bg-gray-100" />
              )}

              <div className="min-w-0">
                <div
                  className={`font-medium leading-snug line-clamp-2 ${
                    isActive ? "underline" : "group-hover:underline"
                  }`}
                >
                  {p.metadata.title}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {p.metadata.date
                    ? new Date(p.metadata.date).toLocaleDateString("tr-TR")
                    : null}
                  {p.metadata.readingTime ? ` · ${p.metadata.readingTime}` : ""}
                </div>
                {Array.isArray(p.metadata.tags) && p.metadata.tags.length > 0 ? (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {p.metadata.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </>
          );

          return (
            <li key={p.slug} className="group">
              {isActive ? (
                // Aktif yazı: link yerine inert blok + aria-current
                <div
                  aria-current="page"
                  className="flex items-start gap-3 opacity-80 cursor-default"
                >
                  {CardInner}
                </div>
              ) : (
                <Link
                  href={`/oyun/${p.slug}`}
                  className="flex items-start gap-3"
                  prefetch
                >
                  {CardInner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

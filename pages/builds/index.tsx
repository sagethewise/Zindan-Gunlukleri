import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

type PostMeta = {
  title: string;
  slug: string;
  date: string;
  tags: string[];
};

export default function BuildList({ builds }: { builds: PostMeta[] }) {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-6">🔨 Build Rehberleri</h1>
      <ul className="space-y-6">
        {builds.map((build) => (
          <li key={build.slug} className="border-b pb-4">
            <Link href={`/builds/${build.slug}`}>
              <h2 className="text-xl font-semibold text-blue-600 hover:underline">
                {build.title}
              </h2>
            </Link>
            <p className="text-sm text-gray-500">{build.date}</p>
            <div className="mt-1 flex gap-2 flex-wrap">
              {build.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 text-gray-700 px-2 py-0.5 text-xs rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

export async function getStaticProps() {
  const directory = path.join("content/builds");
  const files = fs.readdirSync(directory);

  const builds = files.map((filename) => {
    const fileContent = fs.readFileSync(path.join(directory, filename), "utf8");
    const { data } = matter(fileContent);

    return {
      title: data.title,
      slug: data.slug,
      date: data.date,
      tags: data.tags || [],
    };
  });

  // Tarihe göre sırala (yeni olan üstte)
  builds.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

  return {
    props: {
      builds,
    },
  };
}

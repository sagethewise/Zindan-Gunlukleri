import fs from "fs";
import path from "path";
import matter from "gray-matter";

type ContentMeta = {
  title: string;
  slug: string;
  date: string;
  tags?: string[];
  type: "oyun" | "build";
};

function readContent(dir: string, type: "oyun" | "build"): ContentMeta[] {
  const fullPath = path.join(process.cwd(), "content", dir);
  if (!fs.existsSync(fullPath)) return [];

  const files = fs.readdirSync(fullPath).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  return files.map((filename) => {
    const fileContent = fs.readFileSync(path.join(fullPath, filename), "utf8");
    const { data } = matter(fileContent);

    return {
      title: data.title,
      slug: filename.replace(/\.mdx?$/, ""),
      date: data.date,
      tags: data.tags || [],
      type,
    };
  });
}

export function getAllOyunContent(): ContentMeta[] {
  const oyun = readContent("oyun", "oyun");
  const builds = readContent("builds", "build");

  return [...oyun, ...builds].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

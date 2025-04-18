import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post } from '@/lib/types';

function readPostsFrom(dir: string, type: 'oyun' | 'gundem'): Post[] {
  const fullPath = path.join(process.cwd(), 'content', dir);
  if (!fs.existsSync(fullPath)) return [];

  const files = fs.readdirSync(fullPath).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));

  return files.map((filename) => {
    const slug = filename.replace(/\.mdx?$/, '');
    const fullPathToFile = path.join(fullPath, filename);
    const fileContent = fs.readFileSync(fullPathToFile, 'utf8');
    const { content, data } = matter(fileContent);

    return {
      slug,
      content,
      metadata: {
        summary: data.summary || "",  
        title: data.title,
        date: data.date,
        tags: data.tags || [],
        category: data.category || '',
        coverImage: data.coverImage || '',
        readingTime: data.readingTime || '',
        type: type

      },
    };
  });
}

export function getAllPosts(): Post[] {
  const oyunPosts = readPostsFrom('oyun', 'oyun');
  
  return [...oyunPosts].sort((a, b) =>
    Date.parse(b.metadata.date) - Date.parse(a.metadata.date)
  );
}

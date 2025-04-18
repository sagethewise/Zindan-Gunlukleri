import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post } from './types';

export function getAllPosts(): Post[] {
  const contentDirs = ['oyun', 'gundem'];
  const allPosts: Post[] = [];

  for (const dir of contentDirs) {
    const fullPath = path.join(process.cwd(), 'content', dir);
    if (!fs.existsSync(fullPath)) continue;

    const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.md'));

    for (const filename of files) {
      const slug = filename.replace(/\.md$/, '');
      const filePath = path.join(fullPath, filename);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);
      console.log(`${slug} ➜`, data); // ✅ ekle!

      allPosts.push({
        slug,
        content,
        metadata: {
          title: data.title,
          date: data.date,
          tags: data.tags || [],
          category: data.category || '',
          coverImage: data.coverImage || '',
          readingTime: data.readingTime || '',
          type: dir === 'gundem' ? 'gundem' : 'oyun',
          summary: undefined,
            featured: data.featured || false,
        },
      });
    }
  }

  return allPosts.sort((a, b) => Date.parse(b.metadata.date) - Date.parse(a.metadata.date));
}

export function getPostBySlug(slug: string): Post | null {
  const contentDirs = ['oyun', 'gundem'];

  for (const dir of contentDirs) {
    const filePath = path.join(process.cwd(), 'content', dir, `${slug}.md`);
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);

      return {
        slug,
        content,
        metadata: {
          title: data.title,
          date: data.date,
          tags: data.tags || [],
          category: data.category || '',
          coverImage: data.coverImage || '',
          readingTime: data.readingTime || '',
          type: dir === 'gundem' ? 'gundem' : 'oyun',
          summary: undefined,
          featured: data.featured || false,
        },
      };
    }
  }

  return null;
}

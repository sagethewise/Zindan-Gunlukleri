import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post } from './types';

export function getAllPosts(): Post[] {
  const contentDirs = ['oyun', 'gundem'];
  const allPosts: Post[] = [];
  console.log(allPosts.map(p => `${p.metadata.date} - ${p.slug}`));

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
          summary: typeof data.summary === "string" ? data.summary : "",
            featured: data.featured || false,
        },
      });
    }
  }

  return allPosts.sort((a, b) => {
    const dateA = Date.parse(a.metadata.date || '');
    const dateB = Date.parse(b.metadata.date || '');
    if (isNaN(dateA)) return 1;
    if (isNaN(dateB)) return -1;
    return dateB - dateA;
  });
  
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
          summary: typeof data.summary === "string" ? data.summary : "",
          featured: data.featured || false,
        },
      };
    }
  }

  return null;
}

/** Sadece tek bir klasörden (oyun | gundem) okur ve tarihine göre sıralar */
export function getAllPostsByType(type: 'oyun' | 'gundem'): Post[] {
  const dir = type; // klasör adıyla birebir
  const all: Post[] = [];

  const fullPath = path.join(process.cwd(), 'content', dir);
  if (!fs.existsSync(fullPath)) return [];

  const files = fs.readdirSync(fullPath).filter((f) => f.endsWith('.md'));

  for (const filename of files) {
    const slug = filename.replace(/\.md$/, '');
    const filePath = path.join(fullPath, filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    all.push({
      slug,
      content,
      metadata: {
        title: data.title,
        date: data.date,
        tags: data.tags || [],
        category: data.category || '',
        coverImage: data.coverImage || '',
        readingTime: data.readingTime || '',
        type, // klasörden gelen net tip
        summary: typeof data.summary === 'string' ? data.summary : '',
        featured: data.featured || false,
      },
    });
  }

  return all.sort((a, b) => {
    const dateA = Date.parse(a.metadata.date || '');
    const dateB = Date.parse(b.metadata.date || '');
    if (isNaN(dateA)) return 1;
    if (isNaN(dateB)) return -1;
    return dateB - dateA;
  });
}

/** Aynı tipteki yazılardan, mevcut yazıyı hariç tutarak related listesi üretir. */
export function getRelatedPostsByType(
  type: 'oyun' | 'gundem',
  currentSlug: string,
  currentTags: string[] = [],
  limit = 10
): Post[] {
  const pool = getAllPostsByType(type).filter((p) => p.slug !== currentSlug);
  if (currentTags.length === 0) return pool.slice(0, limit);

  const tagSet = new Set(currentTags);
  const byTag = pool.filter(
    (p) => Array.isArray(p.metadata.tags) && p.metadata.tags.some((t) => tagSet.has(t))
  );

  return (byTag.length > 0 ? byTag : pool).slice(0, limit);
}

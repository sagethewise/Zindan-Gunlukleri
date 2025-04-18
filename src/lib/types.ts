

// src/lib/types.ts
export interface PostMetadata {
  title: string;
  date: string;
  summary: string;
  category: string;
  tags?: string[];
  coverImage?: string;
  readingTime?: string;
}

export type Post = {
  slug: string;
  content: string;
  metadata: {
    summary: string;
    title: string;
    date: string;
    tags?: string[];
    category?: string;
    coverImage?: string;
    readingTime?: string;
    type?: 'oyun' | 'gundem'; // ✅ Buraya ekliyoruz
    featured?: boolean;
  };
};

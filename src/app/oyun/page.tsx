import { getAllPosts } from './loader';
import BlogClient from './BlogClient';
import { Post } from '@/lib/types'; // If you moved the type out

export default function OyunPage() {
  const posts: Post[] = getAllPosts();
  return <BlogClient posts={posts} />;
}

import { getAllPosts } from '@/lib/posts';
import GundemClient from './GundemClient'; // veya senin bileşenin


export default function GundemPage() {
  const allPosts = getAllPosts();
  const gundemPosts = allPosts.filter(post => post.metadata.type === 'gundem');

  return <GundemClient posts={gundemPosts} />;
}

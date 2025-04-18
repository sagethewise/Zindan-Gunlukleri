// lib/markdownToHtml.ts
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(gfm) // GitHub Flavored Markdown (tables, strikethrough, etc.)
    .use(html)
    .process(markdown);
  return result.toString();
}

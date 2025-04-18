import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { GetStaticPaths, GetStaticProps } from "next";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";

// Import custom MDX components
import HeroImage from "@/components/HeroImage";
import Summary from "@/components/Summary";
import SkillTag from "@/components/SkillTag";
import Tip from "@/components/Tip";
import BuildTable from "@/components/BuildTable";

const components = {
  HeroImage,
  Summary,
  SkillTag,
  Tip,
  BuildTable,
};

type Props = {
  source: MDXRemoteSerializeResult;
  frontMatter: {
    title: string;
    slug: string;
    date: string;
    tags: string[];
  };
};

export default function BuildPage({ source, frontMatter }: Props) {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-2">{frontMatter.title}</h1>
      <p className="text-sm text-gray-500 mb-6">{frontMatter.date}</p>
      <MDXRemote {...source} components={components} />
    </main>
  );
}

// 🔁 Build pathlerini üretir
export const getStaticPaths: GetStaticPaths = async () => {
  const files = fs.readdirSync(path.join("content/builds"));
  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace(".mdx", ""),
    },
  }));

  return {
    paths,
    fallback: false, // Tüm sayfalar build zamanında oluşturulacak
  };
};

// 📦 Sayfa içeriğini alır
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const filePath = path.join("content/builds", slug + ".mdx");
  const fileContent = fs.readFileSync(filePath, "utf8");

  const { content, data } = matter(fileContent);
  const mdxSource = await serialize(content, { scope: data });

  return {
    props: {
      source: mdxSource,
      frontMatter: data,
    },
  };
};

// src/app/build-firini/[slug]/page.tsx

import BuildDetail from "@/components/builds/BuildDetail";
import { getBuildBySlug } from "@/lib/builds";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BuildDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const build = await getBuildBySlug(slug);

  if (!build) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-[#ffffff] text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <BuildDetail build={build} />
      </div>
    </div>
  );
}

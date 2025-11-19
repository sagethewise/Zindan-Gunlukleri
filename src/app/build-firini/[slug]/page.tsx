import { notFound } from "next/navigation";
import { getBuildBySlug } from "@/lib/builds";
import BuildDetail from "@/components/builds/BuildDetail";
import BuildDetailLayout from "@/lib/buildDetailLayout";

interface PageProps {
  params: { slug: string };
}

export default async function BuildDetailPage({ params }: PageProps) {
  const build = await getBuildBySlug(params.slug);

  if (!build) {
    return notFound();
  }

  return (
    <BuildDetailLayout build={build}>
      <BuildDetail build={build} />
    </BuildDetailLayout>
  );
}

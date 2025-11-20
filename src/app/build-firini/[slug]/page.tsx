// src/app/build-firini/[slug]/page.tsx
import { getSkillsByKeys } from "@/lib/d4Skills";
import BuildDetail from "@/components/builds/BuildDetail";
import { getBuildBySlug } from "@/lib/builds";
import { notFound } from "next/navigation";
import SkillsSection from "@/components/builds/SkillsSection";
import { barbarianLungingStrikeSkills } from "@/lib/buildConfigs/barbarian";
import { spiritbornQuillVolleySkills } from "@/lib/buildConfigs/spiritborn";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BuildDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const build = await getBuildBySlug(slug);

  if (!build) {
    return notFound();
  }
  const skillKeys = spiritbornQuillVolleySkills; // ileride bunu build.datasından türetebiliriz
  const skills = await getSkillsByKeys([...skillKeys]);

  return (
    <div className="min-h-screen bg-[#ffffff] text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <BuildDetail build={build} />
        <SkillsSection skills={skills} />
      </div>
    </div>
  );
}

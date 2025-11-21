// src/app/build-firini/[slug]/page.tsx
import { getSkillsByNames, getSkillsByKeys } from "@/lib/d4Skills";
import BuildDetail from "@/components/builds/BuildDetail";
import { getBuildBySlug } from "@/lib/builds";
import { notFound } from "next/navigation";
import SkillsSection from "@/components/builds/SkillsSection";
import { barbarianLungingStrikeSkills } from "@/lib/buildConfigs/barbarian";
import { spiritbornQuillVolleySkills } from "@/lib/buildConfigs/spiritborn";

interface PageProps {
  params: { slug: string };
}

export default async function BuildDetailPage({ params }: PageProps) {
  const { slug } = params;

  const build = await getBuildBySlug(slug);

  if (!build) {
    return notFound();
  }

  // build.classId: "barbarian" | "druid" | "sorcerer" | "rogue" | "necromancer" | "spiritborn"
  const classId = build.classId;

  // 1) Varsayılan boş array
  let skills = [];

  // 2) Barbarian & Spiritborn için build’e özel key listeleri kullan
  if (classId === "barbarian") {
    skills = await getSkillsByKeys([...barbarianLungingStrikeSkills]);
  } else if (classId === "spiritborn") {
    skills = await getSkillsByKeys([...spiritbornQuillVolleySkills]);
  } else {
    // 3) Diğer tüm class’lar için: d4_skills’ten class_key’e göre skill çek
    //    Burada build’e özel değil, class kit’inden örnek skill’ler gösteriyoruz.
    skills = await getSkillsByNames(classId, 5); // 12: göstermek istediğin skill sayısı
  }

  return (
    <div className="min-h-screen bg-[#ffffff] text-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <BuildDetail build={build} />
        {/* Gear tab'ı zaten BuildDetail içinde. Skills Section'ı ayrı blokta gösteriyoruz. */}
        <SkillsSection skills={skills} />
      </div>
    </div>
  );
}
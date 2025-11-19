import BuildFirini from "@/components/builds/BuildFirini";
import { CURRENT_D4_SEASON, KNOWN_D4_SEASONS } from "@/lib/d4Config";
import { getBuildsBySeason } from "@/lib/builds";
import { notFound } from "next/navigation";

interface SeasonPageProps {
  params: { season: string };
}

export default async function SeasonPage({ params }: SeasonPageProps) {
  const seasonNumber = Number(params.season);

  if (!Number.isFinite(seasonNumber) || !KNOWN_D4_SEASONS.includes(seasonNumber)) {
    return notFound();
  }

  const builds = await getBuildsBySeason(seasonNumber);

  return (
    <BuildFirini
      season={seasonNumber}
      isCurrent={seasonNumber === CURRENT_D4_SEASON}
      builds={builds}
    />
  );
}

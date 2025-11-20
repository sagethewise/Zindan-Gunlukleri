// src/app/build-firini/season/[season]/page.tsx

import BuildFirini from "@/components/builds/BuildFirini";
import { getBuildsBySeason } from "@/lib/builds";
import { CURRENT_D4_SEASON } from "@/lib/constants";

export default async function SeasonPage({
  params,
}: {
  params: Promise<{ season: string }>;
}) {
  // Next 15: params bir Promise
  const { season } = await params;

  const seasonNumber = Number(season ?? CURRENT_D4_SEASON);
  const builds = await getBuildsBySeason(seasonNumber);

  return (
    <BuildFirini
      season={seasonNumber}
      isCurrent={seasonNumber === CURRENT_D4_SEASON}
      builds={builds}
    />
  );
}

// src/app/build-firini/season/[season]/page.tsx

import BuildFirini from "@/components/builds/BuildFirini";
import { getBuildsBySeason } from "@/lib/builds";
import { CURRENT_D4_SEASON } from "@/lib/constants";

export default async function SeasonPage({ params }: any) {
  // Next 15'te params Promise olduğu için:
  const resolved = await params;
  const seasonParam = resolved?.season ?? CURRENT_D4_SEASON;
  const seasonNumber = Number(seasonParam);

  const builds = await getBuildsBySeason(seasonNumber);

  return (
    <BuildFirini
      season={seasonNumber}
      isCurrent={seasonNumber === CURRENT_D4_SEASON}
      builds={builds}
    />
  );
}

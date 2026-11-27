// src/app/build-firini/season/[season]/page.tsx

import BuildFirini from "@/components/builds/BuildFirini";
import { getBuildsBySeason } from "@/lib/builds";
import {notFound} from "next/navigation";
import { TARGET_D4_SEASON,isKnownSeason } from "@/lib/constants";

export default async function SeasonPage({
  params,
}: {
  params: Promise<{ season: string }>;
}) {
  // Next 15: params bir Promise
  const { season } = await params;

  const seasonNumber = Number(season ?? TARGET_D4_SEASON);
  if(!isKnownSeason(seasonNumber))notFound();
  const builds = await getBuildsBySeason(seasonNumber);

  return (
    <BuildFirini
      season={seasonNumber}
      isCurrent={seasonNumber === TARGET_D4_SEASON}
      builds={builds}
    />
  );

  
}


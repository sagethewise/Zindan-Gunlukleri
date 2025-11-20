// src/app/build-firini/season/[season]/page.tsx

import BuildFirini from "@/components/builds/BuildFirini";
import { getBuildsBySeason } from "@/lib/builds";
import { CURRENT_D4_SEASON } from "@/lib/constants";

type SeasonPageProps = {
  params: {
    season: string;
  };
};

export default async function SeasonPage({ params }: SeasonPageProps) {
  const seasonNumber = Number(params.season);

  const builds = await getBuildsBySeason(seasonNumber);

  return (
    <BuildFirini
      season={seasonNumber}
      isCurrent={seasonNumber === CURRENT_D4_SEASON}
      builds={builds}
    />
  );
}

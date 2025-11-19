import { getHomepageBuilds } from "@/lib/builds";
import { CURRENT_D4_SEASON } from "@/lib/constants";
import BuildFirini from "@/components/builds/BuildFirini";

export default async function BuildFiriniPage() {
  const builds = await getHomepageBuilds(CURRENT_D4_SEASON);

  return (
    <BuildFirini 
      builds={builds} 
      season={CURRENT_D4_SEASON} 
    />
  );
}

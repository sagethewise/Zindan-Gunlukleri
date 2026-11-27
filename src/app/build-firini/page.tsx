import { getHomepageBuilds } from "@/lib/builds";
import { CURRENT_D4_SEASON } from "@/lib/constants";
import BuildFirini from "@/components/builds/BuildFirini";

// Fetch live builds so a temporary database outage cannot freeze an empty list at build time.
export const dynamic = "force-dynamic";

export default async function BuildFiriniPage() {
  const builds = await getHomepageBuilds(CURRENT_D4_SEASON);

  return (
    <BuildFirini 
      builds={builds} 
      season={CURRENT_D4_SEASON} 
    />
  );
}
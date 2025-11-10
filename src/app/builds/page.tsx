import BuildShell, { BuildItem } from "@/components/builds/BuildShell";

// Şimdilik mock; sonra Supabase'ten dolduracağız
async function fetchInitialBuilds(): Promise<BuildItem[]> {
  // örnek veri
  return [
    {
      id: "whirlwind-s11",
      title: "Whirlwind Rage",
      pit: 140,
      class: "barbarian",
      icons: ["/skills/barb1.png","/skills/barb2.png","/skills/barb3.png"],
      author: "Rob2628",
      season: "11",
      mode: "endgame",
    },
    {
      id: "pulverize-s11",
      title: "Pulverize",
      pit: 135,
      class: "druid",
      icons: ["/skills/dru1.png","/skills/dru2.png"],
      author: "MetaTeam",
      season: "11",
      mode: "endgame",
    },
  ];
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function BuildsHome() {
  const initialBuilds = await fetchInitialBuilds();
  return <BuildShell initialBuilds={initialBuilds} />;
}

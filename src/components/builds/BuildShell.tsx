"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

const SEASONS = ["11", "10", "9", "8"];
const MODES = [
  { key: "endgame", label: "Endgame" },
  { key: "leveling", label: "Leveling" },
];
const CLASSES = [
  { key: "barbarian", label: "Barbarian", icon: "/icons/barbarian.png" },
  { key: "druid", label: "Druid", icon: "/icons/druid.png" },
  { key: "necromancer", label: "Necromancer", icon: "/icons/necromancer.png" },
  { key: "rogue", label: "Rogue", icon: "/icons/rogue.png" },
  { key: "sorcerer", label: "Sorcerer", icon: "/icons/sorcerer.png" },
  { key: "spiritborn", label: "Spiritborn", icon: "/icons/spiritborn.png" }, // varsa
];

export type BuildItem = {
  id: string;
  title: string;
  pit?: number; // “Pit 140”
  class: string;
  icons: string[]; // skill/aspect küçük ikon URL’leri
  author?: string;
  season: string;
  mode: "leveling" | "endgame";
};

export default function BuildShell({
  initialBuilds,
}: {
  initialBuilds: BuildItem[];
}) {
  const router = useRouter();
  const q = useSearchParams();

  const [season, setSeason] = useState(q.get("season") || "11");
  const [mode, setMode] = useState<"leveling" | "endgame">(() => {
    const m = q.get("mode");
    return m === "leveling" || m === "endgame" ? m : "endgame";
  });
  const [cls, setCls] = useState(q.get("class") || "");
  const [search, setSearch] = useState(q.get("search") || "");

  // URL senkronu
  const push = (params: Record<string, string>) => {
    const merged = new URLSearchParams(q.toString());
    Object.entries(params).forEach(([k, v]) =>
      v ? merged.set(k, v) : merged.delete(k)
    );
    router.push(`/builds?${merged.toString()}`);
  };

  const filtered = useMemo(() => {
    return initialBuilds.filter((b) => {
      if (season && b.season !== season) return false;
      if (mode && b.mode !== mode) return false;
      if (cls && b.class !== cls) return false;
      if (search && !b.title.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [initialBuilds, season, mode, cls, search]);

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Sidebar */}
      <aside className="col-span-12 md:col-span-3 bg-zinc-900 rounded-xl p-3 md:p-4">
        <h2 className="text-lg font-semibold mb-3">Classes</h2>
        <ul className="space-y-1">
          {CLASSES.map((c) => {
            const active = cls === c.key;
            return (
              <li key={c.key}>
                <button
                  onClick={() => {
                    const next = active ? "" : c.key;
                    setCls(next);
                    push({ class: next });
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 transition ${
                    active ? "bg-zinc-800 ring-1 ring-zinc-700" : ""
                  }`}
                >
                  {/* yerel iconları /public/icons/* içine koy */}
                  <img src={c.icon} alt={c.label} width={20} height={20} />
                  <span>{c.label}</span>
                  <span className="ml-auto w-4 h-4 rounded border border-zinc-600 bg-zinc-800/50" />
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Content */}
      <section className="col-span-12 md:col-span-9">
        {/* Top bar: Season + Search + Tabs */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm opacity-70">Season</label>
            <select
              value={season}
              onChange={(e) => {
                setSeason(e.target.value);
                push({ season: e.target.value });
              }}
              className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1"
            >
              {SEASONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                push({ search: e.target.value });
              }}
              placeholder="Search by build or skill…"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-9 pr-3 py-2"
            />
          </div>

          <div className="flex items-center gap-2">
            {MODES.map((m) => (
              <button
                key={m.key}
                onClick={() => {
                  setMode(m.key as "leveling" | "endgame");
                  push({ mode: m.key });
                }}
                className={`px-3 py-1.5 rounded-lg border text-sm ${
                  mode === m.key
                    ? "bg-zinc-800 border-zinc-600"
                    : "border-zinc-800 hover:border-zinc-700"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section header (Meta Builds) */}
        <div className="bg-zinc-900 rounded-lg px-3 py-2 mb-3 text-sm font-medium">
          Meta Builds
        </div>

        {/* Build list */}
        <div className="space-y-3">
          {filtered.map((b) => (
            <a
              key={b.id}
              href={`/builds/${b.season}/${b.mode}/${b.class}/${b.id}`}
              className="flex items-center justify-between bg-zinc-900 hover:bg-zinc-800 rounded-xl p-4 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-zinc-800 grid place-items-center">
                  {/* sınıf ikonunu da gösterebilirsin */}
                  <span className="text-xs capitalize">{b.class[0]}</span>
                </div>
                <div>
                  <div className="font-semibold hover:underline">{b.title}</div>
                  <div className="text-xs opacity-70">
                    {b.author ? `by ${b.author} • ` : ""}
                    Season {b.season} • {b.mode === "endgame" ? "Endgame" : "Leveling"}
                    {typeof b.pit === "number" ? ` • Pit ${b.pit}` : ""}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {b.icons.slice(0, 8).map((i, idx) => (
                  <img
                    key={idx}
                    src={i}
                    alt="skill"
                    width={28}
                    height={28}
                    className="rounded"
                  />
                ))}
                <span className="ml-2 opacity-60">›</span>
              </div>
            </a>
          ))}

          {!filtered.length && (
            <div className="text-sm opacity-70 px-2 py-8 text-center">
              Bu filtrelerle eşleşen build bulunamadı.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

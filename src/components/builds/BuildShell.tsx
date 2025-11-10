"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

// API'nin döndürdüğü satır tipi
type BuildRow = {
  id: string;
  slug: string;
  title: string;
  author: string | null;
  season: number | null;
  mode: "endgame" | "leveling";
  class_key:
    | "barbarian"
    | "druid"
    | "necromancer"
    | "rogue"
    | "sorcerer"
    | "spiritborn"
    | "unknown";
  pit: number | null;
  is_meta: boolean;
  score: number;
  icon_urls: string[] | null;
  updated_at: string;
};

type ApiResp = {
  items: BuildRow[];
  page: number;
  limit: number;
  total: number;
};

const CLASSES: BuildRow["class_key"][] = [
  "barbarian",
  "druid",
  "necromancer",
  "rogue",
  "sorcerer",
  "spiritborn",
];

// küçük yardımcı: query string kur
function qs(obj: Record<string, string | number | undefined>) {
  const p = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== undefined && v !== "" && v !== null) p.set(k, String(v));
  });
  return p.toString();
}

export default function BuildShell() {
  const sp = useSearchParams();
  const router = useRouter();

  // URL state
  const [season, setSeason] = useState<string>(sp.get("season") ?? "");
  const [mode, setMode] = useState<string>(sp.get("mode") ?? "endgame");
  const [classKey, setClassKey] = useState<string>(sp.get("class_key") ?? "");
  const [search, setSearch] = useState<string>(sp.get("search") ?? "");
  const [page, setPage] = useState<number>(Number(sp.get("page") ?? 1));

  // data state
  const [data, setData] = useState<BuildRow[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [limit] = useState<number>(24);
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);

  // URL değiştiğinde form state’i güncelle (tarayıcı geri/ileri uyumu)
  useEffect(() => {
    setSeason(sp.get("season") ?? "");
    setMode(sp.get("mode") ?? "endgame");
    setClassKey(sp.get("class_key") ?? "");
    setSearch(sp.get("search") ?? "");
    setPage(Number(sp.get("page") ?? 1));
  }, [sp]);

  // debounce arama
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  // fetch URL
  const fetchUrl = useMemo(() => {
    const query = qs({
      season: season || undefined,
      mode: mode || undefined,
      class_key: classKey || undefined,
      search: debouncedSearch || undefined,
      limit,
      page,
    });
    return `/api/builds?${query}`;
  }, [season, mode, classKey, debouncedSearch, limit, page]);

  // veri çek
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr(null);
    fetch(fetchUrl, { next: { revalidate: 60 } })
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error ?? "Fetch failed");
        return (r.json() as Promise<ApiResp>);
      })
      .then((json) => {
        if (!alive) return;
        setData(json.items);
        setTotal(json.total);
      })
      .catch((e) => {
        if (!alive) return;
        setErr(e?.message ?? "Unknown error");
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [fetchUrl]);

  // URL'ye yazan submit
  function pushState(nextPage?: number) {
    const query = qs({
      season: season || undefined,
      mode: mode || undefined,
      class_key: classKey || undefined,
      search: search || undefined,
      page: nextPage ?? page,
    });
    router.push(`/builds?${query}`);
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      {/* Kahraman */}
      <section className="text-center bg-zinc-900 text-white rounded-2xl py-10">
        <h1 className="text-3xl md:text-5xl font-extrabold">🔥 BuildFırını</h1>
        <p className="text-zinc-300 mt-2">
          İngilizce terimler, Türkçe açıklamalarla Diablo IV build arşivi.
        </p>
      </section>

      {/* Filtreler */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          pushState(1);
        }}
        className="grid gap-3 md:grid-cols-5"
      >
        <input
          placeholder="Ara: whirlwind, speedfarm…"
          className="border rounded px-3 py-2 md:col-span-2"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select
          className="border rounded px-3 py-2"
          value={classKey}
          onChange={(e) => {
            setClassKey(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Class (all)</option>
          {CLASSES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className="border rounded px-3 py-2"
          value={mode}
          onChange={(e) => {
            setMode(e.target.value);
            setPage(1);
          }}
        >
          <option value="endgame">endgame</option>
          <option value="leveling">leveling</option>
        </select>
        <input
          inputMode="numeric"
          placeholder="Season"
          className="border rounded px-3 py-2"
          value={season}
          onChange={(e) => {
            setSeason(e.target.value.replace(/\D/g, ""));
            setPage(1);
          }}
        />

        <button className="md:col-span-5 rounded bg-black text-white px-4 py-2">
          Filtrele
        </button>
      </form>

      {/* Meta bandı */}
      <div className="rounded-xl border bg-amber-50 text-amber-900 px-4 py-3">
        <strong>Meta Builds</strong> öncelikli listelenir (pit → score →
        alfabetik).
      </div>

      {/* Liste */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-2xl border animate-pulse bg-gray-100"
            />
          ))}
        </div>
      ) : err ? (
        <p className="text-red-600">Hata: {err}</p>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Sonuçlar</h2>
            <span className="text-sm text-gray-500">
              {total} sonuç • {page}/{totalPages}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((b) => (
              <Link
                key={b.id}
                href={`/builds/${b.class_key}/${b.slug}`}
                className="block rounded-2xl border bg-white p-4 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold">{b.title}</h3>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-gray-100">
                    {b.class_key}
                  </span>
                </div>

                {/* küçük rozet ikonları */}
                {!!(b.icon_urls?.length) && (
                  <div className="mt-2 flex gap-1 flex-wrap">
                    {b.icon_urls.slice(0, 8).map((url, i) => (
                      <img
                        key={`${b.id}-icon-${i}`}
                        src={url}
                        alt=""
                        className="h-5 w-5 rounded"
                        loading="lazy"
                      />
                    ))}
                  </div>
                )}

                {/* meta satırı */}
                <div className="mt-3 text-xs text-gray-600 flex items-center gap-3">
                  {b.is_meta && (
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                      META
                    </span>
                  )}
                  {typeof b.pit === "number" && <span>Pit {b.pit}</span>}
                  <span>
                    {new Date(b.updated_at).toLocaleDateString("tr-TR")}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                disabled={page <= 1}
                onClick={() => {
                  const next = Math.max(1, page - 1);
                  setPage(next);
                  pushState(next);
                }}
                className="rounded border px-3 py-1 disabled:opacity-50"
              >
                ← Prev
              </button>
              <span className="text-sm text-gray-600">
                {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => {
                  const next = Math.min(totalPages, page + 1);
                  setPage(next);
                  pushState(next);
                }}
                className="rounded border px-3 py-1 disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

import {messages, type Locale} from "@/lib/i18n";
interface BuildFiriniBannerProps {
  season: number;
  locale?:Locale;
  isCurrent?: boolean;
  children?: React.ReactNode; // SEARCH BAR BURADAN GELİYOR
}

export default function BuildFiriniBanner({
  season,
  locale="tr",
  isCurrent,
  children,
}: BuildFiriniBannerProps) {
  const m=messages[locale];
  const seasonLabel = `${m.season} ${season}`;

  return (
    <section
      className="
        mb-6 overflow-hidden rounded-2xl 
        bg-gradient-to-r from-[#dbd3bf] via-[#e8e2d5] to-[#faf7f0]
        px-4 py-6 sm:px-6
        text-slate-900
      "
    >
      <div className="flex flex-col gap-6">
        
        {/* Üst içerik */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-[11px] font-medium text-stone-800">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-stone-500" />
              Dungeon Diaries · {m.forge}
            </div>

            {/* Açıklama */}
            <p className="max-w-xl text-[12px] text-stone-900/80">
              {locale==="tr"?"Build içerikleri Dungeon Diaries tarafından yabancı kaynaklardan derlenmiş ve Türkçe olarak yeniden düzenlenmiştir.":m.source}
            </p>

            {/* Başlık */}
            <div>
              <h1 className="text-xl font-bold tracking-tight text-stone-950/80 sm:text-2xl">
                {m.builds}
              </h1>
              <p className="mt-1 max-w-xl text-[12px] text-stone-900/80">
                {locale==="tr"?"Leveling ve endgame build’lerini filtrele ve karşılaştır.":locale==="de"?"Filtere und vergleiche Leveling- und Endgame-Builds.":"Filter and compare leveling and endgame builds."}
              </p>
            </div>
          </div>

          {/* Sağ blok */}
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-stone-900 shadow-sm">
              <span className="text-[11px] uppercase tracking-wide text-stone-700">
                {m.season}
              </span>
              <span className="rounded-full bg-stone-600 px-2 py-0.5 text-[11px] text-white">
                {seasonLabel}
              </span>
            </div>

            {isCurrent && (
              <span className="text-[11px] text-stone-800/80">
                {locale==="tr"?"Aktif sezon":locale==="de"?"Aktuelle Saison":"Current season"}
              </span>
            )}
          </div>
        </div>

        {/* 🔥 SEARCH BAR SLOT (banner içinde) */}
        {children && <div className="pt-2">{children}</div>}
      </div>
    </section>
  );
}

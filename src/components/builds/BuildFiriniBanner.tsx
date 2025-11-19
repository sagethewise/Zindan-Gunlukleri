interface BuildFiriniBannerProps {
  season: number;
  isCurrent?: boolean;
  children?: React.ReactNode; // SEARCH BAR BURADAN GELİYOR
}

export default function BuildFiriniBanner({
  season,
  isCurrent,
  children,
}: BuildFiriniBannerProps) {
  const seasonLabel = `Season ${season}`;

  return (
    <section
      className="
        mb-6 overflow-hidden rounded-2xl 
        bg-gradient-to-r from-[#C3B3FF] via-[#E2D4FF] to-[#F8F4FF]
        px-4 py-6 sm:px-6
        text-slate-900
      "
    >
      <div className="flex flex-col gap-6">
        
        {/* Üst içerik */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-[11px] font-medium text-purple-800">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-purple-500" />
              Zindan Günlükleri · Build Fırını
            </div>

            {/* Açıklama */}
            <p className="max-w-xl text-[12px] text-purple-900/80">
              Build içerikleri Zindan Günlükleri tarafından yabancı kaynaklardan
              derlenmiş ve Türkçe olarak yeniden düzenlenmiştir.
            </p>

            {/* Başlık */}
            <div>
              <h1 className="text-xl font-bold tracking-tight text-purple-950/80 sm:text-2xl">
                Diablo 4 Meta Build Rehberi
              </h1>
              <p className="mt-1 max-w-xl text-[12px] text-purple-900/80">
                {seasonLabel} için leveling ve endgame build’lerini tek ekrandan
                filtrele, karşılaştır ve detay sayfalarına geç.
              </p>
            </div>
          </div>

          {/* Sağ blok */}
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-purple-900 shadow-sm">
              <span className="text-[11px] uppercase tracking-wide text-purple-700">
                Aktif Sezon
              </span>
              <span className="rounded-full bg-purple-600 px-2 py-0.5 text-[11px] text-white">
                {seasonLabel}
              </span>
            </div>

            {isCurrent && (
              <span className="text-[11px] text-purple-800/80">
                Şu anda aktif olan sezondaki build’ler gösteriliyor.
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

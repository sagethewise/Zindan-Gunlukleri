"use client";

import { useEffect, useRef, useState } from "react";
import TocSelect from "./TocSelect";

/**
 * Mobil/Tablet için sabit TOC bar:
 * - header yüksekliğini ölçer ve onun hemen altında sabitlenir
 * - layout kaymaması için aynı yükseklikte bir spacer bırakır
 * - xl ve üstünde kullanılmaz (page.tsx tarafında gizleyeceğiz)
 */
export default function MobileTocBar() {
  const [top, setTop] = useState<number>(56); // header yaklaşık
  const spacerRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>("header");

    const recompute = () => {
      // 1) Header yüksekliği kadar yukarıdan başla
      const headerH = Math.round(header?.getBoundingClientRect().height ?? 56);
      setTop(headerH);

      // 2) Spacer'ı barın gerçek yüksekliğine göre ayarla (layout kaymasın)
      const barH = Math.round(barRef.current?.getBoundingClientRect().height ?? 48);
      if (spacerRef.current) {
        spacerRef.current.style.height = `${barH + 8}px`; // +8px küçük nefes
      }
    };

    recompute();

    // Değişimlerde yeniden hesapla
    window.addEventListener("resize", recompute);
    const ro = new ResizeObserver(recompute);
    if (header) ro.observe(header);

    return () => {
      window.removeEventListener("resize", recompute);
      ro.disconnect();
    };
  }, []);

  return (
    <>
      {/* Bar sabitleneceği için bıraktığımız yer tutucu */}
      <div ref={spacerRef} className="xl:hidden" aria-hidden="true" />

      {/* Header'ın hemen altında sabitlenen bar */}
      <div className="xl:hidden fixed left-0 right-0 z-30" style={{ top }}>
        <div className="mx-auto max-w-screen-xl px-4">
          <div
            ref={barRef}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm"
          >
            <TocSelect />
          </div>
        </div>
      </div>
    </>
  );
}
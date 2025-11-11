'use client';

import { useEffect, useMemo, useState } from 'react';

type TocItem = {
  id: string;
  text: string;
  level: number; // 2 = H2, 3 = H3
};

export default function StickyToc() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Makaledeki H2/H3 başlıklarından TOC üret
  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>('article.markdown-body h2, article.markdown-body h3')
    );

    const toc = headings
      .filter(h => h.id) // remark-slug id verdi
      .map(h => ({
        id: h.id,
        // baştaki emoji/ikonları temizle (görünüm aynıdır, TOC metnini sadeleştiriyoruz)
        text: h.innerText.replace(/^[^\wığüşöçİĞÜŞÖÇ]+/, ''),
        level: Number(h.tagName.replace('H', '')), // 2 ya da 3
      }));

    setItems(toc);

    // Sayfa hash ile açıldıysa aktif başlığı ayarla
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setActiveId(id);
    }
  }, []);

  // Scrollspy: aktif başlığı takip et
  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>('article.markdown-body h2, article.markdown-body h3')
    );
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target instanceof HTMLElement) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        // başlığı ekranın üstüne yaklaştığında aktif say
        rootMargin: '0px 0px -70% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    headings.forEach(h => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  const onClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    // URL hash'i güncelle ve yumuşak kaydır
    window.history.replaceState(null, '', `#${id}`);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const hasItems = useMemo(() => items.length > 0, [items]);
  if (!hasItems) return null;

  return (
    <aside className="hidden lg:block lg:sticky lg:top-24 self-start max-h-[calc(100vh-6rem)] overflow-auto pl-6 border-l border-gray-700/50">
  <div className="text-sm font-semibold mb-3 opacity-80 uppercase tracking-wide"></div>
  <nav aria-label="Table of contents">
    <ul className="space-y-1">
      {items.map(({ id, text, level }) => {
        const isActive = id === activeId;
        return (
          <li key={id}>
            <button
              onClick={() => onClick(id)}
              className={[
                'text-left w-full truncate transition-all duration-200',
                level === 3 ? 'pl-5 text-sm opacity-80' : 'pl-2',
                isActive
                  ? 'font-semibold text-green-500 border-l-2 border-green-500 pl-[calc(0.5rem-2px)]'
                  : 'text-gray-400 hover:text-green-400 border-l-2 border-transparent'
              ].join(' ')}
              title={text}
            >
              {text}
            </button>
          </li>
        );
      })}
    </ul>
  </nav>
</aside>
  );
}

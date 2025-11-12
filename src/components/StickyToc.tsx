"use client";
import { useEffect, useMemo, useState } from "react";

type TocItem = { id: string; text: string; level: number };

export default function StickyToc({ className = "" }: { className?: string }) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const heads = Array.from(
      document.querySelectorAll<HTMLElement>("article.markdown-body h2, article.markdown-body h3")
    );
    const toc = heads
      .filter((h) => h.id)
      .map((h) => ({
        id: h.id,
        text: h.innerText.replace(/^[^\wığüşöçİĞÜŞÖÇ]+/, ""),
        level: Number(h.tagName.replace("H", "")),
      }));
    setItems(toc);
    if (location.hash) setActiveId(location.hash.replace("#", ""));
  }, []);

  useEffect(() => {
    const heads = Array.from(
      document.querySelectorAll<HTMLElement>("article.markdown-body h2, article.markdown-body h3")
    );
    if (!heads.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (vis[0]?.target instanceof HTMLElement) setActiveId(vis[0].target.id);
      },
      { rootMargin: "0px 0px -70% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    heads.forEach((h) => obs.observe(h));
    return () => obs.disconnect();
  }, []);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.history.replaceState(null, "", `#${id}`);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const has = useMemo(() => items.length > 0, [items]);
  if (!has) return null;

  return (
    <nav aria-label="Table of contents" className={className}>
      <ul className="space-y-1">
        {items.map(({ id, text, level }) => {
          const isActive = id === activeId;
          return (
            <li key={id}>
              <button
                onClick={() => go(id)}
                className={[
                  "text-left w-full truncate transition-all duration-200",
                  level === 3 ? "pl-5 text-sm opacity-80" : "pl-2",
                  isActive
                    ? "font-semibold text-green-500 border-l-2 border-green-500 pl-[calc(0.5rem-2px)]"
                    : "text-gray-400 hover:text-green-400 border-l-2 border-transparent",
                ].join(" ")}
                title={text}
              >
                {text}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

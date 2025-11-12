"use client";
import { useEffect, useMemo, useState } from "react";

type TocItem = { id: string; text: string; level: number };

export default function TocSelect() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [value, setValue] = useState<string>("");

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
  }, []);

  const has = useMemo(() => items.length > 0, [items]);
  if (!has) return null;

  const onChange = (id: string) => {
    setValue(id);
    const el = document.getElementById(id);
    if (!el) return;
    window.history.replaceState(null, "", `#${id}`);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex items-center gap-2 ">
      <label htmlFor="toc-select" className="text-sm text-gray-600 shrink-0">İçindekiler:</label>
      <select
        id="toc-select"
        className="w-full rounded-lg border glass border-gray-100px-3 py-2 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>Başlık seçin…</option>
        {items.map(({ id, text, level }) => (
          <option key={id} value={id}>
            {level === 3 ? "— " : ""}
            {text}
          </option>
        ))}
      </select>
    </div>
  );
}

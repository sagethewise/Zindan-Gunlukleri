// src/components/builds/BuildMetaHeader.tsx

import {buildText} from "@/lib/build-i18n";
import type {Locale} from "@/lib/i18n";
export default function BuildMetaHeader({locale="tr"}:{locale?:Locale}) {
  return (
    <div className="mb-3 rounded-md bg-gradient-to-r from-[#d8d4c0] via-[#e5dfd0] to-[#f0ebe1] text-stone-950 shadow-lg shadow-stone-300/30 px-3 py-2 text-xs font-semibold">
      {buildText[locale].meta}
    </div>
  );
}

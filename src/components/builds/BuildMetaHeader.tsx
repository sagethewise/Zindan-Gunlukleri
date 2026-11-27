// src/components/builds/BuildMetaHeader.tsx

import {buildText} from "@/lib/build-i18n";
import type {Locale} from "@/lib/i18n";
export default function BuildMetaHeader({locale="tr"}:{locale?:Locale}) {
  return (
    <div className="mb-3 rounded-md bg-gradient-to-r from-[#baade9] via-[#b9b0cc] to-[#d2c8e2] text-purple-950 shadow-lg shadow-purple-300/30 px-3 py-2 text-xs font-semibold">
      {buildText[locale].meta}
    </div>
  );
}

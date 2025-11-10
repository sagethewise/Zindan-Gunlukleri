// src/components/TierListLoader.tsx
"use client";
import dynamic from "next/dynamic";
import type { TierGame } from "@/lib/tier-list-data";

export type TierId = "S" | "A" | "B" | "C" | "D" | "unranked";
export type TierItems = Record<TierId, TierGame[]>;

const TierListClient = dynamic(() => import("./TierListClient"), { ssr: false });

export default function TierListLoader(props: { listData?: TierItems; isReadOnly?: boolean }) {
  return <TierListClient {...props} />;
}

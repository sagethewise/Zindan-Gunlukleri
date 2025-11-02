// TierListLoader.tsx
"use client";
import dynamic from "next/dynamic";

const TierListClient = dynamic(() => import("./TierListClient"), {
  ssr: false,
});

export default function TierListLoader() {
  return <TierListClient />;
}

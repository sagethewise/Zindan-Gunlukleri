"use client";

import dynamic from 'next/dynamic';

const TierListClient = dynamic(
  () => import('@/components/TierListClient'),
  { 
    ssr: false,
    loading: () => <p className="text-center text-lg p-10">Tier List Yükleniyor...</p> 
  }
);

// GÜNCELLEME: Artık prop göndermiyoruz.
export default function TierListLoader() {
  return <TierListClient />;
}
// app/tier-list/page.tsx

import { initialGames } from '@/lib/tier-list-data';
// YENİ: Artık doğrudan TierListLoader'ı import ediyoruz.
import TierListLoader from '@/components/TierListLoader';

export default function TierListPage() {
  return (
    <main className="px-4 py-8 max-w-7xl mx-auto">
      <section className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900">
          Oyun Yılı Tier Listesi
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Summer Game Fest ve The Game Awards oyunlarını sırala!
        </p>
      </section>
            <section className="text-center mt-10 text-gray-500">
        <p>Oyunları kutular arasında sürükleyip bırakarak kendi listenizi oluşturun.</p>
      </section>

      {/* Artık dinamik import yerine doğrudan Loader komponentimizi çağırıyoruz. */}
      <TierListLoader initialGames={initialGames} />

    </main>
  );
}
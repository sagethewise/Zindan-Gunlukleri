// src/components/TierListClient.tsx

"use client";

import { useState, useEffect, FormEvent } from 'react';
import { DndContext, useDraggable, useDroppable, closestCorners, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { TierGame } from '@/lib/tier-list-data';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const Tiers = {
  S: "bg-red-500",
  A: "bg-orange-500",
  B: "bg-yellow-500",
  C: "bg-green-500",
  D: "bg-blue-500",
};
type TierId = keyof typeof Tiers | 'unranked';

function GameCard({ game, onClick }: { game: TierGame; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: game.id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} onClick={onClick} className="p-1 bg-white rounded-md shadow-sm cursor-grab active:cursor-grabbing z-10 hover:ring-2 hover:ring-blue-500 transition-shadow">
      <div className="relative w-20 h-24"><Image src={game.imageUrl || '/images/default.jpg'} alt={game.name} fill className="object-cover rounded" sizes="80px" /></div>
    </div>
  );
}

function TierRow({ id, games, label, color, handleCardClick }: { id: TierId; games: TierGame[]; label: string; color: string; handleCardClick: (game: TierGame, tierId: TierId) => void; }) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div className="flex items-stretch min-h-[120px] border-b border-gray-300">
      <div className={`w-24 flex items-center justify-center text-4xl font-bold text-white ${color}`}>{label}</div>
      <div ref={setNodeRef} className="flex-1 p-2 bg-gray-200/50 flex flex-wrap items-start gap-2">
        {games.map(game => (game && <GameCard key={game.id} game={game} onClick={() => handleCardClick(game, id)} />))}
      </div>
    </div>
  );
}

// GÜNCELLEME: initialGames prop'u kaldırıldı.
export default function TierListClient() {
  const [items, setItems] = useState<Record<TierId, TierGame[]>>({ 
    S: [], A: [], B: [], C: [], D: [], unranked: [] 
  });

  const [newGameName, setNewGameName] = useState('');
  const [newGameImageUrl, setNewGameImageUrl] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  // GÜNCELLEME: useEffect'in mantığı değiştirildi.
  useEffect(() => {
    // 1. Önce localStorage'dan kaydettiğimiz sıralamayı yükleyelim.
    const savedItems = localStorage.getItem('tierListState');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }

    // 2. Sonra havuzu doldurmak için veritabanından tüm oyunları çekelim.
    const fetchGames = async () => {
        try {
            const response = await fetch('/api/games');
            if (!response.ok) throw new Error('Oyunlar veritabanından çekilemedi.');
            
            const allGamesFromDB = await response.json();
            
            // 3. Sıralanmış oyunları havuzda tekrar göstermemek için birleştirme yapalım.
            setItems(currentItems => {
                const rankedGameIds = new Set(
                    Object.values(currentItems)
                        .flat()
                        .filter(Boolean)
                        .map(game => game.id)
                );

                const newUnrankedGames = allGamesFromDB.filter(
                    (game: TierGame) => !rankedGameIds.has(game.id)
                );

                return { ...currentItems, unranked: newUnrankedGames };
            });
        } catch (error) {
            console.error(error);
        }
    };

    fetchGames();
    
    // Oturum bilgisini alma mantığı aynı kalıyor
    const supabase = createClientComponentClient();
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  // Yaptığımız sıralamaları anlık olarak localStorage'a kaydetmeye devam et
  useEffect(() => {
    // Başlangıçtaki boş state'i kaydetmemek için kontrol
    const totalGames = Object.values(items).flat().length;
    if (totalGames > 0) {
        localStorage.setItem('tierListState', JSON.stringify(items));
    }
  }, [items]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 10 } }));
  const { setNodeRef: unrankedContainerRef } = useDroppable({ id: 'unranked' });

  const handleAddGame = async (e: FormEvent) => {
    e.preventDefault();
    if (!newGameName.trim()) return;

    try {
        const response = await fetch('/api/games', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newGameName, imageUrl: newGameImageUrl || '/images/default.jpg' }),
        });
        if (!response.ok) throw new Error("Oyun eklenemedi. Giriş yapmış olmalısınız.");
        const newGame = await response.json();
        setItems(prev => ({ ...prev, unranked: [newGame, ...prev.unranked] }));
        setNewGameName('');
        setNewGameImageUrl('');
    } catch (error) {
        alert((error as Error).message);
    }
  };

  // GÜNCELLEME: resetList fonksiyonu artık initialGames'e bağımlı değil.
  const resetList = () => {
    const allGamesInList = Object.values(items).flat().filter(Boolean);
    setItems({ S: [], A: [], B: [], C: [], D: [], unranked: allGamesInList });
  };

  const handleCardClick = (clickedGame: TierGame, sourceTierId: TierId) => {
    if (sourceTierId === 'unranked') return;
    setItems(prev => ({
      ...prev,
      [sourceTierId]: prev[sourceTierId].filter(g => g.id !== clickedGame.id),
      unranked: [...prev.unranked, clickedGame],
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id.toString();
    const overId = over.id.toString() as TierId;
    const activeContainerId = Object.keys(items).find(key => items[key as TierId].some(item => item && item.id === activeId)) as TierId;
    if (!activeContainerId || !overId || activeContainerId === overId) return;
    setItems(prev => {
      const activeContainerItems = prev[activeContainerId];
      const overContainerItems = prev[overId];
      const draggedItem = activeContainerItems.find(item => item && item.id === activeId);
      if (!draggedItem) return prev;
      return {
        ...prev,
        [activeContainerId]: activeContainerItems.filter(item => item.id !== activeId),
        [overId]: [...overContainerItems, draggedItem],
      };
    });
  };
  
 const handleSaveList = async () => {
    if (!session) {
        alert('Listeyi kaydetmek için lütfen giriş yapın.');
        router.push('/login');
        return;
    }
    
    const listName = prompt("Lütfen listeniz için bir isim girin:", "Benim Tier Listem");
    
    if (!listName) return; // Kullanıcı iptal ederse işlemi durdur.

    setIsSaving(true); // Yükleme durumunu başlat (Buton 'Kaydediliyor...' olacak)
    try {
        const response = await fetch('/api/lists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ listName: listName, listData: items }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Liste kaydedilemedi.');
        }

        const savedList = await response.json();
        
        // alert() ve console.log() yerine, kullanıcıyı yeni say_faya yönlendir
        router.push(`/lists/${savedList.id}`);

    } catch (error) {
        alert((error as Error).message);
        setIsSaving(false); // Hata durumunda da yükleme durumunu kapat
    } 
    // Not: Başarılı olunca yönlendirme olacağı için `finally` bloğuna gerek kalmadı.
  };

  return (
    <>
      <form onSubmit={handleAddGame} className="max-w-2xl mx-auto mb-8 p-4 bg-gray-50 rounded-lg shadow">
        <h4 className="text-lg font-semibold mb-2">Genel Havuza Oyun Ekle</h4>
        <div className="flex flex-col md:flex-row gap-4">
            <input type="text" value={newGameName} onChange={(e) => setNewGameName(e.target.value)} placeholder="Oyun Adı" className="flex-1 p-2 border rounded-md" required />
            <input type="text" value={newGameImageUrl} onChange={(e) => setNewGameImageUrl(e.target.value)} placeholder="Resim URL'si (Opsiyonel)" className="flex-1 p-2 border rounded-md" />
            <button type="submit" className="px-6 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-500" disabled={!session}>Ekle</button>
        </div>
      </form>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden my-10 border border-gray-200">
          {Object.entries(Tiers).map(([id, color]) => (
            <TierRow key={id} id={id as TierId} games={items[id as TierId] || []} label={id} color={color} handleCardClick={handleCardClick} />
          ))}
          <div className="p-4 bg-gray-800 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Derecelendirilecek Oyunlar</h3>
            <div className="flex gap-x-2">
                <button onClick={handleSaveList} disabled={isSaving || !session} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors">
                    {isSaving ? 'Kaydediliyor...' : 'Listeyi Kaydet'}
                </button>
                <button onClick={resetList} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Listeyi Sıfırla</button>
            </div>
          </div>
          <div className="bg-gray-800 px-4 pb-4">
              <div ref={unrankedContainerRef} className="min-h-[140px] p-2 bg-gray-700 rounded-md flex flex-wrap items-start gap-2">
                  {items.unranked?.map(game => (
                    game && <GameCard key={game.id} game={game} onClick={() => handleCardClick(game, 'unranked')} />
                  ))}
              </div>
          </div>
        </div>
      </DndContext>
    </>
  );
}
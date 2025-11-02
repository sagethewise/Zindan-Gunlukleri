export interface TierGame {
  id: string;
  name: string;
  imageUrl: string;
}

// Burayı Summer Game Fest veya GOTY adaylarıyla doldurabilirsin.
// Resim URL'lerini sitenin public klasörüne yüklediğin görsellerle değiştirebilirsin.
export const initialGames: TierGame[] = [
  { id: 'game-1', name: 'Astro Bot', imageUrl: '/images/tier-games/astobot.png' },
  { id: 'game-2', name: 'Outer Worlds II', imageUrl: '/images/tier-games/outerworlds2.png' },
  { id: 'game-3', name: 'Atomic Heart', imageUrl: '/images/tier-games/atomicheart.png' },
  { id: 'game-4', name: 'Gears of War: E-Day', imageUrl: '/images/tier-games/gearsofwar.png' },
  { id: 'game-5', name: 'Fable', imageUrl: '/images/tier-games/fable.png' },
  { id: 'game-6', name: 'Black Myth: Wukong', imageUrl: '/images/tier-games/blackmyth.png' },
  { id: 'game-7', name: 'Code Vein II', imageUrl: '/images/tier-games/codevein2.png' },
  { id: 'game-8', name: 'Game of thrones: War for Westeros', imageUrl: '/images/tier-games/gameofthrones.png' },
  { id: 'game-9', name: 'Resident Evil IV Requiem', imageUrl: '/images/tier-games/residentevil.png' },
];
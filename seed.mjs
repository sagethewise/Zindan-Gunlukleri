// seed.mjs

import { createClient } from '@supabase/supabase-js';

// Kendi listenizi buraya kopyalayın
const initialGames = [
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

// Supabase bilgilerinizi buraya girin
const supabaseUrl = 'https://sabqnocmojsvqchufplj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhYnFub2Ntb2pzdnFjaHVmcGxqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTM4NTMwMSwiZXhwIjoyMDY0OTYxMzAxfQ.UGd-yILyX4pxF4G5rHVGJfrfNww9CKdNDAsj5C2_gQI'; // DİKKAT: service_role key'ini kullanın!

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedGames() {
  console.log('Oyunlar veritabanına ekleniyor...');

  // Veritabanı sütun isimleriyle eşleşmesi için veriyi formatlayın
  const formattedGames = initialGames.map(game => ({
    name: game.name,
    image_url: game.imageUrl,
  }));

  const { data, error } = await supabase
    .from('games')
    .insert(formattedGames)
    .select();

  if (error) {
    console.error('Hata:', error.message);
  } else {
    console.log(`${data.length} oyun başarıyla eklendi!`);
  }
}

seedGames();
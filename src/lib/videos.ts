export type VideoItem = {
  id: string;
  title: string;
  description: string;
  date: string; // ISO format
  category: "BG3" | "DnD" | "Diablo";
};

export const videos: VideoItem[] = [
  {
    id: "VrNVUEhbULg",
    title: "BG3: Drow Günlükleri #1",
    description: "Baldur's Gate 3 - Egzotik Drow Ranger Karakter Oluşturma",
    date: "2025-05-10",
    category: "BG3",
  },
  {
    id: "qWZku4IqB0M",
    title: "BG3: Drow Günlükleri #2",
    description: "Baldur's Gate 3 Egzotik Drow Oyun Sahnesi 1",
    date: "2025-05-10",
    category: "BG3",
  },
  {
    id: "cv195M9eF1A",
    title: "Dungeons and Dragons: Ravenloft | Lanetli Ev ve Sis Çocukları – Bölüm 1 | Barovia’da Kabus Başlıyor!",
    description: "Maceracıların Ravenloft’daki ilk Encounter'ı",
    date: "2025-05-23",
    category: "DnD",
  },
  {
    id: "jJAreHZAhxA",
    title: "Diablo 4 Sezon 8 Geldiii! - Belial's Return",
    description: "Yeni sezon run... Spiritborn yeni sezon build test run",
    date: "2025-04-30",
    category: "Diablo",
  },
  // Diğer videoları buraya ekleyebilirsin
];

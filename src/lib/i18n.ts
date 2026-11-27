export const locales = ["tr", "en", "de"] as const;
export type Locale = typeof locales[number];
export const isLocale = (value: string): value is Locale => locales.some(l => l === value);
export const localeFromPath = (path: string): Locale => {
  const first = path.split("/")[1];
  return first === "en" || first === "de" ? first : "tr";
};
const routes = {
  home: {tr:"", en:"", de:""},
  games: {tr:"oyun", en:"games", de:"spiele"},
  forge: {tr:"build-firini", en:"build-forge", de:"build-schmiede"},
  videos: {tr:"videolar", en:"videos", de:"videos"},
  about: {tr:"about", en:"about", de:"ueber-uns"},
  contact: {tr:"contact", en:"contact", de:"kontakt"},
} as const;
export type Section = keyof typeof routes;
export function localizedPath(locale: Locale, section: Section = "home", suffix = "") {
  return "/" + [locale === "tr" ? "" : locale, routes[section][locale], suffix].filter(Boolean).join("/");
}
export function switchLocale(path: string, target: Locale) {
  const current = localeFromPath(path);
  const parts = path.split("/").filter(Boolean).slice(current === "tr" ? 0 : 1);
  const section = (Object.keys(routes) as Section[]).find(s => routes[s][current] === (parts[0] ?? ""));
  if (!section) return localizedPath(target);
  const suffix = parts.slice(1);
  if (section === "forge" && suffix[0] === (current === "de" ? "saison" : "season")) suffix[0] = target === "de" ? "saison" : "season";
  return localizedPath(target, section, suffix.join("/"));
}
export const messages = {
  tr: {home:"Anasayfa",games:"Oyunlar",forge:"Build Fırını",videos:"Videolar",about:"Hakkımızda",contact:"İletişim",explore:"Keşfet",follow:"Bizi takip et",rights:"Tüm hakları saklıdır.",language:"Dil",menu:"Menüyü aç/kapat",tagline:"İki oyuncu. Sonsuz macera.",intro:"RPG dünyalarını birlikte keşfediyoruz. Oyun rehberleri, build'ler ve maceralarımız.",watch:"YouTube'da izle",latest:"Son videolar",guides:"Oyun rehberleri",all:"Tümü",search:"Başlıkta ara…",empty:"Şu anda video bulunamadı.",source:"Orijinal içerik Türkçe.",read:"Yazıyı oku",original:"Türkçe orijinali oku",builds:"Diablo IV build rehberleri",season:"Sezon",searchBuild:"Build veya yetenek ara…",noBuild:"Bu filtreye uygun build bulunamadı.",detail:"Detay",name:"İsim",email:"E-posta",house:"Hangi Hogwarts binası?",message:"Mesaj",send:"Gönder",contactIntro:"Görüş ve önerilerinizi duymak isteriz.",description:"RPG oyunları, rehberler, build araçları ve iki oyuncunun maceraları."},
  en: {home:"Home",games:"Games",forge:"Build Forge",videos:"Videos",about:"About us",contact:"Contact",explore:"Explore",follow:"Follow us",rights:"All rights reserved.",language:"Language",menu:"Toggle menu",tagline:"Two players. Endless adventures.",intro:"We explore RPG worlds together. Discover game guides, builds and our adventures.",watch:"Watch on YouTube",latest:"Latest videos",guides:"Gaming guides",all:"All",search:"Search titles…",empty:"No videos available right now.",source:"The original content is in Turkish.",read:"Read guide",original:"Read the Turkish original",builds:"Diablo IV build guides",season:"Season",searchBuild:"Search builds or skills…",noBuild:"No builds match these filters.",detail:"Details",name:"Name",email:"Email",house:"Which Hogwarts house?",message:"Message",send:"Send",contactIntro:"We would love to hear your feedback and suggestions.",description:"RPG games, guides, build tools and adventures from two players."},
  de: {home:"Startseite",games:"Spiele",forge:"Build-Schmiede",videos:"Videos",about:"Über uns",contact:"Kontakt",explore:"Entdecken",follow:"Folge uns",rights:"Alle Rechte vorbehalten.",language:"Sprache",menu:"Menü öffnen/schließen",tagline:"Zwei Spieler. Endlose Abenteuer.",intro:"Wir erkunden gemeinsam RPG-Welten. Entdecke Spielguides, Builds und unsere Abenteuer.",watch:"Auf YouTube ansehen",latest:"Neueste Videos",guides:"Spielguides",all:"Alle",search:"Titel suchen…",empty:"Derzeit sind keine Videos verfügbar.",source:"Der Originalinhalt ist auf Türkisch.",read:"Guide lesen",original:"Türkisches Original lesen",builds:"Diablo IV Build-Guides",season:"Saison",searchBuild:"Builds oder Fertigkeiten suchen…",noBuild:"Keine Builds entsprechen den Filtern.",detail:"Details",name:"Name",email:"E-Mail",house:"Welches Hogwarts-Haus?",message:"Nachricht",send:"Senden",contactIntro:"Wir freuen uns auf dein Feedback und deine Vorschläge.",description:"RPG-Spiele, Guides, Build-Tools und Abenteuer von zwei Spielern."}
} as const;

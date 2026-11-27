import type { Locale } from "./i18n";
import previewNews from "../../content/editorial/preview-news.json";
import publishedNews from "../../content/editorial/published-news.json";
import type { Post } from "./types";
const translations: Record<string, {en:[string,string];de:[string,string]}> = {
"bg3patch8": {en:["Baldur’s Gate 3: Patch 8","A look at the eighth major update."],de:["Baldur’s Gate 3: Patch 8","Ein Blick auf das achte große Update."]},
"diablo-4": {en:["Diablo IV review","Our look at Diablo IV."],de:["Diablo IV im Test","Unser Blick auf Diablo IV."]},
"diablo4-2-5-0-PTR": {en:["Diablo IV 2.5.0 PTR: Major changes before Season 11","Tempering, Masterworking, new armour systems, the Tower dungeon and the return of Lesser Evils."],de:["Diablo IV 2.5.0 PTR: Große Änderungen vor Saison 11","Tempering, Masterworking, neue Rüstungssysteme, der Tower-Dungeon und die Rückkehr der Lesser Evils."]},
"dnd-rehberi": {en:["Getting started with D&D","A guide for new Dungeons & Dragons players."],de:["Einstieg in D&D","Ein Guide für neue Dungeons-&-Dragons-Spieler."]},
"dnd-sorcerer-sinifi-tanitim": {en:["D&D Sorcerer class guide","Explore innate magic, Metamagic and Wild Magic."],de:["D&D: Guide zur Zaubererklasse","Entdecke angeborene Magie, Metamagie und Wilde Magie."]},
"path-of-exile": {en:["Path of Exile beginner’s guide","A quick introduction to the world of Path of Exile."],de:["Path of Exile: Einsteigerguide","Ein schneller Einstieg in die Welt von Path of Exile."]},
"rpg-top-5": {en:["Top 5 fantasy RPGs of 2025","Five fantasy role-playing games."],de:["Die fünf besten Fantasy-RPGs 2025","Fünf Fantasy-Rollenspiele."]},
"spiritborn-quill-volley-endgame": {en:["Spiritborn endgame: Quill Volley and Paragon guide","An endgame character build guide."],de:["Spiritborn-Endgame: Quill Volley und Paragon","Ein Build-Guide für das Endgame."]},
"spiritborn-quill-volley-leveling": {en:["Spiritborn leveling: Quill Volley (1–60)","A Quill Volley leveling build guide."],de:["Spiritborn-Leveling: Quill Volley (1–60)","Ein Quill-Volley-Build zum Leveln."]},
"the-elder-scrolls-IV-oblivion-remastered": {en:["The Elder Scrolls IV: Oblivion Remastered","A look at the 2025 remaster with updated graphics and systems."],de:["The Elder Scrolls IV: Oblivion Remastered","Ein Blick auf das Remaster von 2025 mit modernisierter Grafik und überarbeiteten Systemen."]},
"the-elder-scrolls-IV-oblivion": {en:["The Elder Scrolls IV: Oblivion","An introduction to Bethesda’s landmark 2006 RPG."],de:["The Elder Scrolls IV: Oblivion","Eine Einführung in Bethesdas wegweisendes Rollenspiel von 2006."]},
"valve": {en:["What does the 2026 Steam Machine offer?","Steam Machine, Steam Controller and Steam Frame: which device will shape the future?"],de:["Was bietet die Steam Machine 2026?","Steam Machine, Steam Controller oder Steam Frame: Welches Gerät prägt die Zukunft?"]},
"wod-giris-rehberi": {en:["Getting started with World of Darkness","A guide for new World of Darkness players."],de:["Einstieg in World of Darkness","Ein Guide für neue World-of-Darkness-Spieler."]},
};
export function guideTranslation(post:Post,locale:Locale){
  if(locale==="tr") return {title:post.metadata.title,summary:post.metadata.summary};
  const news={...publishedNews,...previewNews} as Record<string,{en:string[];de:string[]}>;
  const t=(news[post.slug]??translations[post.slug])?.[locale];
  return {title:t?.[0]??post.metadata.title,summary:t?.[1]??""};
}

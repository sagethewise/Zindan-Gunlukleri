"use client";
import {messages,type Locale} from "@/lib/i18n";
const copy={
tr:{title:"Daha fazla içerik ister misiniz?",intro:"Bir konu seçerek yeni rehberler hazırlamamıza yardımcı olun.",options:["Klasik build örnekleri","Taktik ve oynanış önerileri","PHB dışı seçenekler (Xanathar’s Guide, Tasha’s Cauldron)","Karakter kâğıdı"]},
en:{title:"Want more content?",intro:"Choose a topic to help us prepare future guides.",options:["Classic build examples","Tactics and gameplay tips","Options beyond the PHB (Xanathar’s Guide, Tasha’s Cauldron)","Character sheet"]},
de:{title:"Wünschst du dir mehr Inhalte?",intro:"Wähle ein Thema, damit wir neue Guides vorbereiten können.",options:["Klassische Build-Beispiele","Taktik und Spieltipps","Optionen außerhalb des PHB (Xanathar’s Guide, Tasha’s Cauldron)","Charakterbogen"]}
};
export default function Questionnaire({locale="tr"}:{locale?:Locale}){
 const c=copy[locale];return <div className="dd-questionnaire"><h2>{c.title}</h2><p>{c.intro}</p><form action="https://formsubmit.co/asliggiray@outlook.com" method="POST" className="space-y-3">{c.options.map((option,index)=><label key={index} className="flex items-center gap-3"><input type="radio" name="Tercih Edilen Konu" value={option} required/><span>{option}</span></label>)}<button type="submit" className="dd-button primary">{messages[locale].send}</button></form></div>
}

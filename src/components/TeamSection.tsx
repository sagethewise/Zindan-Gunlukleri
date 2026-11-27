import type {Locale} from "@/lib/i18n";
import Image from "next/image";

type TeamMember = {
  name: string;
  role: string;
  image?: string;
};

const team: TeamMember[] = [
  {
    name: "Renee",
    role: "Oyuncu & Wild Sorcerer",
    image: "/images/renee.png",
  },
  {
    name: "Gülçüyow",
    role: "Hikâye Yazarı & Bard/Rogue ",
    image: "/images/Gülçüyow.png",
  },
  {
    name: "Mufuks",
    role: "Karakter Tasarımı & Lore Master",
    image: "/images/mufuks.png",
  },
  {
    name: "Sabyricon",
    role: "Müzik Danışmanı & Fighter",
    image: "/images/sabyricon.png",
  },
];

const roles={en:["Player & Wild Sorcerer","Story writer & Bard/Rogue","Character design & Lore Master","Music adviser & Fighter"],de:["Spielerin & Wild Sorcerer","Geschichtenerzähler & Bard/Rogue","Charakterdesign & Lore Master","Musikberater & Fighter"]};
export default function TeamSection({locale="tr"}:{locale?:Locale}) {
return (
    <div className="w-full flex justify-center px-4">
      <div className="w-full max-w-6xl bg-white rounded-lg p-6 space-y-5">
        <h2 className="text-2xl font-semibold mb-5 text-center">{locale==="tr"?"Ekibimiz":locale==="de"?"Unser Team":"Our team"}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-stone-200 p-4 flex flex-col items-center text-center"
            >
              {member.image && (
                <Image
                  src={member.image}
                  alt={member.name}
                  width={96}
                  height={96}
                  className="rounded-full mb-4 mx-auto object-cover"
                />
              )}
              <h3 className="text-lg font-medium text-gray-800">{member.name}</h3>
              <p className="text-sm text-gray-600">{locale==="tr"?member.role:roles[locale][i]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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

export default function TeamSection() {
  return (
    <div className="w-full flex justify-center px-4">
      <div className="w-full max-w-6xl bg-white rounded-lg p-6 space-y-5">
        <h2 className="text-2xl font-semibold mb-5 text-center">👥 Yowbalamlar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4 text-center">
              {member.image && (
                <Image
                  src={member.image}
                  alt={member.name}
                  width={96}
                  height={128}
                  className="rounded-full mb-4 object-cover"
                />
              )}
              <h3 className="text-lg font-medium text-gray-800">{member.name}</h3>
              <p className="text-sm text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";

type TeamMember = {
    name: string;
    role: string;
    avatar?: string;
  };
  
  const team: TeamMember[] = [
    {
      name: "Aslı",
      role: "Dungeon Master & Oyuncu",
      avatar: "/images/asli.jpeg",
    },
    {
      name: "Gülçi",
      role: "Video Editörü & Hikâye Yazarı",
      avatar: "/avatars/gülçi.png",
    },
    {
      name: "Mufux",
      role: "Lore Danışmanı & Karakter Tasarımcısı",
      avatar: "/avatars/mufux.png",
    },
    {
        name: "Sabyricon",
        role: "Müzik Danışmanı & Para Babası",
        avatar: "/avatars/sabyricon.png",
      },
  ];
  
  export default function TeamSection() {
    return (
      <div className="w-full flex justify-center px-4">
      <div className="w-full max-w-6xl bg-white dark:bg-gray-900 rounded-lg p-6 space-y-5">
        <h2 className="text-2xl font-semibold mb-5 text-center">👥 Yowbalamalar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
              {member.avatar && (
                <Image
                  src={member.avatar}
                  alt={member.name}
                  width={96}
                  height={96}
                  className="rounded-full mb-4 object-cover"
                />
              )}
              <h3 className="text-lg font-medium">{member.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{member.role}</p>
            </div>
          ))}
          </div>
        </div>
      </div>
    );
  }
  
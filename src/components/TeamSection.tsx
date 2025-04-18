
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
      <div className="className=w-full max-w-md bg-white dark:bg-gray-900 rounded-lg p-6 space-y-5">
        <h2 className="text-xl font-semibold mb-5 text-center">👥 Yowbalamalar</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {team.map((member, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
              {member.avatar && (
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
                />
              )}
              <h3 className="text-lg font-medium">{member.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
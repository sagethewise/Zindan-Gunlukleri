import Link from "next/link";
import Image from "next/image";

export default function FooterBanner() {
  return (
  
   <section className="w-full bg-[#ED371B] rounded-lg py-6">
  <div className="relative w-full max-w-7xl mx-auto overflow-hidden rounded-lg">
    <Link
      href="https://www.youtube.com/@gg_asli"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Zindan Günlükleri YouTube kanalına git"
    >
      <Image
        src="/images/1920x260.png"
        alt="Blog Banner"
        width={1440}
        height={600}
        priority
        className="object-cover object-center rounded-lg"
      />
      {/* Gerekirse buraya bir üstüne yazı / buton da ekleyebilirsin */}
    </Link>
  </div>
</section>

  );
}

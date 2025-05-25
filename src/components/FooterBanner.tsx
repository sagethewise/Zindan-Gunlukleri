import Link from "next/link";

export default function FooterBanner() {
  return (
    <section className="w-full bg-[#ED371B] rounded-lg py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div
          className="relative h-48 md:h-64 rounded-lg overflow-hidden bg-no-repeat bg-center bg-cover"
          style={{ backgroundImage: "url('/images/1920x260.png')" }}
        >
          <Link
            href="https://www.youtube.com/@gg_asli"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Zindan Günlükleri YouTube kanalına git"
            className="absolute inset-0 z-10"
          />
        </div>
      </div>
    </section>
  );
}

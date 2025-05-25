import Image from "next/image";


export default function HeroBanner() {
  return (
    <section className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden">
      <Image
        src="/images/homepage.png" // kendi dosya yolunu yaz
        alt="Zindan Günlükleri Hero Banner"
            width={1440}
            height={600}
        className="object-cover "
        priority
      />

      {/* Opsiyonel olarak: Üstüne metin katmanı */}
      {/*  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center px-4">
        <h1 className="text-2xl md:text-4xl font-bold">🎲 Zindan Günlükleri</h1>
        <p className="mt-2 text-sm md:text-lg">
          Her oyunu yeni bir hikâyeye dönüştürüyoruz
        </p>
        <Link
          href="https://www.youtube.com/@ZindanGunlukleri"
          target="_blank"
          className="mt-4 inline-block px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full"
        >
          YouTube’da Bizi Takip Et
        </Link>
      </div>  */}
    </section>
  );
}

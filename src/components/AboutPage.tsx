"use client";

import Link from "next/link";
import YouTubeEmbed from "./YouTubeEmbed";
import TeamSection from "./TeamSection";
import Image from "next/image";
//import ContactForm from "./ContactForm";

export default function AboutPage() {
  return (
    <main className="px-4 py-8 max-w-7xl mx-auto grid gap-6">
      {/* 🖼️ Banner Section */}
<section
  className="relative w-full rounded-lg overflow-hidden mb-2">
    <Image
               src="/images/1920x260.png"
               alt="Blog Banner"
               width={1440}
               height={600}
               priority
               className="object-cover object-center"
             />
  {/* Sadece banner alanını tıklanabilir yapar */}
  <Link
    href="https://www.youtube.com/@gg_asli"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Dungeon Diaries YouTube kanalına git"
    className="absolute inset-0 cursor-pointer"
  />
             {/* Dark overlay */}
        {/* <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-white/20 to-transparent backdrop-sm z-10" />*/}
      </section>

      <h1 className="text-4xl font-bold mb-6">🧙‍♂️ Hakkımızda</h1>
      <p className="mb-4 leading-relaxed">
        <strong>Dungeon Diaries</strong>, karanlık mağaralardan büyüyle
        örülmüş diyarların sokaklarına, vampir saraylarından kadim ejderha
        inlerine uzanan bir yolculuğun adıdır.
      </p>
      <p className="mb-4 leading-relaxed">
        Fantastik evrenlere olan tutkumuzu; hem masaüstü FRP oyunlarına
        (Dungeons & Dragons, World of Darkness) hem de dijital oyun dünyasına
        (WoW, Diablo, Baldur’s Gate 3, Sims 4) yansıtarak bu platformda bir
        araya getiriyoruz.
      </p>
      <p className="mb-4 leading-relaxed">
        Bu blogda; <br />
        🎲 FRP rehberleri, <br />
        📚 oyun dünyasına dair analizler, <br />
        🧩 sistem önerileri, <br />
        ve 🧵 Quest fikirleri bulacaksınız.
      </p>
      <h2 className="text-2xl font-semibold mt-10 mb-4">
        🎥 YouTube&apos;da Bizimle Derinlere Dal
      </h2>
      <p className="mb-4 leading-relaxed">
        <strong>Dungeon Diaries</strong> adlı YouTube kanalımızda, oyun
        içeriklerinden seans özetlerine, karakter analizlerinden atmosferik
        video serilerine kadar dijital FRP dünyasını keşfetmeye devam ediyoruz.
      </p>

      <h2 className="text-2xl font-semibold mt-12 mb-4">🧭 Biz Kimiz?</h2>
      <p className="mb-4 leading-relaxed">
        Oyun yöneticileri, oyuncular, hikâye anlatıcıları, dijital gezginler...{" "}
        <br />
        Kimi zaman bir büyücü, kimi zaman bir vampir avcısı, ama her daim{" "}
        <strong>hikâyenin bir parçası.</strong>
      </p>
      <p className="leading-relaxed italic">
        Eğer sen de bu evrenin bir parçası olmak istiyorsan; ister bir büyü
        fısılda, ister zindana bir iz bırak… <strong>yerin burada.</strong>
      </p>
      <YouTubeEmbed />

      <p className="mt-4">
        🎬 Daha fazlası için kanalımıza göz at:{" "}
        <Link
          href="https://www.youtube.com/@gg_asli"
          target="_blank"
          className="text-red-600 hover:underline font-semibold"
        >
          Dungeon Diaries YouTube
        </Link>
      </p>

      {/* 2-column layout for team and contact 
      <section className="mt-16 grid md:grid-cols-1 gap-8">
        <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 flex flex-col justify-between">
          <TeamSection />
        </div>
   <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 flex flex-col justify-between">
          <ContactForm />
        </div> 
      </section>*/}
      <TeamSection />
    </main>
  );
}

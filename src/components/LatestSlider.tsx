'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';

import { Post } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';

export default function LatestSlider({ posts }: { posts: Post[] }) {
  const latestPosts = [...posts]
    .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime())
    .slice(0, 5);

  return (
    <section className="relative max-w-[1280px] mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-center text-brand mb-10">📢 Son Yazılar</h2>

      {/* Custom arrows */}
      <div className="absolute left-0 top-[50%] z-10 transform -translate-y-1/2">
        <div className="swiper-button-prev !text-brand rounded-full w-10 h-10 flex items-center justify-center" />
      </div>
      <div className="absolute right-0 top-[50%] z-10 transform -translate-y-1/2">
        <div className="swiper-button-next !text-brand rounded-full w-10 h-10 flex items-center justify-center" />
      </div>

      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        spaceBetween={30}
        breakpoints={{
          0: { slidesPerView: 1.2 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        modules={[EffectCoverflow, Navigation]}
        className="w-full"
      >
        {latestPosts.map((post) => (
          <SwiperSlide
            key={post.slug}
            className="w-[320px] h-[420px] relative group bg-white shadow-md rounded-2xl overflow-hidden"
          >
            <Link href={`/oyun/${post.slug}`} className="block w-full h-full relative">
              <div className="relative w-full h-52 overflow-hidden">
                <Image
                  src={post.metadata.coverImage || '/images/default.jpg'}
                  alt={post.metadata.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 bg-white/80 text-xs px-2 py-1 rounded backdrop-blur text-gray-800 font-medium">
                  {post.metadata.type === 'gundem' ? 'Gündem' : 'Oyun'}
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white/90 via-white/70 to-transparent p-4">
                <p className="text-xs text-brand uppercase mb-1">{post.metadata.category}</p>
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">{post.metadata.title}</h3>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{post.metadata.summary}</p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

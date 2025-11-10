import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["img.youtube.com"],
    remotePatterns: [
      // YouTube Ana Thumbnail Sunucusu
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      // Google User Content (hata mesajınızdakiyle eşleşen)
      {
        protocol: 'https',
        hostname: 'yt3.ggpht.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      // Geniş bir kural olarak ekleyelim
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
    ],
  },
    // ⚙️ Workspace uyarısını susturur:
  outputFileTracingRoot: "C:\\Users\\Renee\\Desktop\\Web-Design\\pheonix-site",
};

export default nextConfig;
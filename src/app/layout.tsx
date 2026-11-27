import "./globals.css";
import { ReactNode } from "react";
import { headers } from "next/headers";
import { isLocale, messages } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";

export async function generateMetadata() {
  const value = (await headers()).get("x-dd-locale") ?? "tr";
  const locale = isLocale(value) ? value : "tr";
  return { title: "Dungeon Diaries", description: messages[locale].description, metadataBase: new URL("https://zindangunlukleri.com") };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const value = (await headers()).get("x-dd-locale") ?? "tr";
  return (
    <html lang={isLocale(value) ? value : "tr"}>
      <body className="overflow-x-hidden">
        <Header />
        <Analytics />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

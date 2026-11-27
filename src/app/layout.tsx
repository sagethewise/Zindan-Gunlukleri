import "./globals.css";
import { ReactNode } from "react";
import { headers } from "next/headers";
import { isLocale, messages,localizedPath,locales,type Section } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ForgeSourceLinks from "@/components/builds/ForgeSourceLinks";
import { Analytics } from "@vercel/analytics/react";

export async function generateMetadata() {
  const value = (await headers()).get("x-dd-locale") ?? "tr";
  const locale = isLocale(value) ? value : "tr";
  const path=(await headers()).get("x-dd-path")??"/";
  const sections:Section[]=["home","games","forge","videos","about","contact"];
  const section=sections.find(s=>localizedPath(locale,s)===path);
  return { title: "Dungeon Diaries", description: messages[locale].description, metadataBase: new URL("https://zindangunlukleri.com"), ...(section?{alternates:{canonical:path,languages:Object.fromEntries(locales.map(l=>[l,localizedPath(l,section)]))}}:{}) };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const requestHeaders=await headers();
  const value = requestHeaders.get("x-dd-locale") ?? "tr";
  const locale=isLocale(value)?value:"tr";
  const path=requestHeaders.get("x-dd-path")??"/";
  const forge=localizedPath(locale,"forge");
  const showSources=path===forge||path===forge+"/database"||path.startsWith(forge+"/"+(locale==="de"?"saison":"season")+"/");
  return (
    <html lang={isLocale(value) ? value : "tr"}>
      <body className="overflow-x-hidden">
        <Header />
        <Analytics />
        <main>{children}</main>
        {showSources&&<ForgeSourceLinks locale={locale}/>}
        <Footer />
      </body>
    </html>
  );
}

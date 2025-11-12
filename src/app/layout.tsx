import "./globals.css";
import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "Zindan Günlükleri",
  description: "Your portal for games, RPGs, and politics.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body className="overflow-x-hidden">
        <Header />
        <Analytics />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

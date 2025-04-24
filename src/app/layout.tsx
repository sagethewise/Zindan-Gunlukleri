import './globals.css';
import { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Analytics } from "@vercel/analytics/react"

export const metadata = {
  title: 'Zindan Günlükleri',
  description: 'Your portal for games, RPGs, and politics.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
  <Header />
  <Analytics/>
  {children}
  <Footer />
      </body>
    </html>
  );
}

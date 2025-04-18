import './globals.css';
import { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Zindan Günlükleri',
  description: 'Your portal for games, RPGs, and politics.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
  <Header />
  {children}
  <Footer />
      </body>
    </html>
  );
}

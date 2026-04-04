import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'Glowreeyah', template: '%s | Glowreeyah' },
  description: 'Music. Ministry. Movement.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-brand-warm text-brand-deep`}>
        <a href="#main-content" className="sr-only focus:not-sr-only ...">Skip to content</a>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

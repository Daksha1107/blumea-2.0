import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { generateSEOMetadata } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = generateSEOMetadata({
  title: 'SKINCARE & WELLNESS - Expert Reviews & Tips',
  description: 'Discover expert skincare reviews, wellness tips, and beauty guides. Your trusted source for science-backed skincare advice.',
  canonical: process.env.NEXTAUTH_URL || 'https://blumea.com',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

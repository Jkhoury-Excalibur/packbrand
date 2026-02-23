import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Pack Brand Solutions | Custom Branded Packaging',
  description:
    'Premium custom-branded packaging for businesses. Cups, bags, boxes, food containers, napkins, and labels with your logo. Serving the entire United States. Bilingual service in English and Spanish.',
  keywords: [
    'custom packaging',
    'branded cups',
    'custom bags',
    'packaging boxes',
    'food containers',
    'custom labels',
    'wholesale packaging',
    'business branding',
    'Pack Brand Solutions',
  ],
  openGraph: {
    title: 'Pack Brand Solutions | Custom Branded Packaging',
    description:
      'Premium custom-branded packaging for businesses. We dress brands for success.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Pack Brand Solutions',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import '../../globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Admin — Packbrand Solutions',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}})()`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} antialiased bg-pbs-gray-50 dark:bg-pbs-gray-950`}>
        <div className="flex min-h-screen">
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}

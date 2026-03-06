import Link from 'next/link';
import { Package } from 'lucide-react';

export default function NotFound() {
  return (
    <html lang="en">
      <body className="antialiased bg-pbs-gray-50 dark:bg-pbs-gray-950">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-pbs-red shadow-lg shadow-pbs-red/25 mb-6">
              <Package className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-7xl font-black text-pbs-gray-900 dark:text-white tracking-tight mb-2">
              404
            </h1>
            <h2 className="text-xl font-bold text-pbs-gray-900 dark:text-white mb-3">
              Page Not Found
            </h2>
            <p className="text-pbs-gray-500 dark:text-pbs-gray-400 mb-8 leading-relaxed">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-pbs-red text-white text-sm font-semibold hover:bg-pbs-red/90 transition-colors"
              >
                Back to Home
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl border-2 border-pbs-gray-200 dark:border-pbs-gray-700 text-sm font-semibold text-pbs-gray-700 dark:text-pbs-gray-300 hover:border-pbs-red hover:text-pbs-red transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

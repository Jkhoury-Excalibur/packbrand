'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push('/account'), 800);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-pbs-gray-50 dark:bg-pbs-gray-950 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 -right-32 w-72 h-72 rounded-full bg-pbs-red/5 dark:bg-pbs-red/10" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-pbs-gold/5" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-pbs-red shadow-lg shadow-pbs-red/25 mb-4">
            <Package className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-pbs-gray-900 dark:text-white tracking-tight">
            Packbrand Solutions
          </h1>
          <p className="text-pbs-gray-500 dark:text-pbs-gray-400 text-sm mt-1">
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-pbs-gray-400" />
                <input
                  id="email"
                  type="email"
                  defaultValue="maria@gopicadera.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 text-pbs-gray-900 dark:text-white text-sm focus:outline-none focus:border-pbs-red transition-colors"
                  placeholder="you@yourcompany.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest">
                  Password
                </label>
                <button type="button" className="text-xs text-pbs-red hover:underline font-medium">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-pbs-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  defaultValue="password123"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border-2 border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 text-pbs-gray-900 dark:text-white text-sm focus:outline-none focus:border-pbs-red transition-colors"
                  placeholder="Your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-pbs-gray-400 hover:text-pbs-gray-600 dark:hover:text-pbs-gray-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Signing In…' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm text-pbs-gray-500 dark:text-pbs-gray-400 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/contact" className="text-pbs-red font-medium hover:underline">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

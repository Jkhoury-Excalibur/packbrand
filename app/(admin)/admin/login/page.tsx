'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push('/admin/dashboard'), 800);
  };

  return (
    <div className="min-h-screen bg-pbs-gray-50 dark:bg-pbs-gray-950 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-pbs-red/5 dark:bg-pbs-red/10" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-pbs-gold/5 dark:bg-pbs-gold/5" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-pbs-red shadow-lg shadow-pbs-red/30 mb-4">
            <Package className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-pbs-gray-900 dark:text-white tracking-tight">
            Packbrand Solutions
          </h1>
          <p className="text-pbs-gray-500 dark:text-pbs-gray-400 text-sm mt-1">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 shadow-sm p-8">
          <h2 className="text-xl font-bold text-pbs-gray-900 dark:text-white mb-1">Sign In</h2>
          <p className="text-sm text-pbs-gray-500 dark:text-pbs-gray-400 mb-6">
            Enter your credentials to access the dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  defaultValue="admin@packbrandsolutions.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 text-pbs-gray-900 dark:text-white text-sm focus:outline-none focus:border-pbs-red transition-colors"
                  placeholder="admin@packbrandsolutions.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-pbs-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  defaultValue="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border-2 border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 text-pbs-gray-900 dark:text-white text-sm focus:outline-none focus:border-pbs-red transition-colors"
                  placeholder="Enter your password"
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

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              disabled={loading}
            >
              {loading ? 'Signing In…' : 'Sign In'}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-pbs-gray-400 mt-6">
          © {new Date().getFullYear()} Packbrand Solutions. Internal use only.
        </p>
      </div>
    </div>
  );
}

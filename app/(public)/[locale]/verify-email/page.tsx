'use client';

import { useState } from 'react';
import { Package, Mail, RefreshCw } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';

export default function VerifyEmailPage() {
  const [resent, setResent] = useState(false);

  const handleResend = () => {
    setResent(true);
    setTimeout(() => setResent(false), 4000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-pbs-gray-50 dark:bg-pbs-gray-950 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 -right-32 w-72 h-72 rounded-full bg-pbs-red/5 dark:bg-pbs-red/10" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-pbs-gold/5" />
      </div>

      <div className="relative w-full max-w-md text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-pbs-red shadow-lg shadow-pbs-red/25 mb-6">
          <Mail className="h-8 w-8 text-white" />
        </div>

        <h1 className="text-2xl font-bold text-pbs-gray-900 dark:text-white tracking-tight mb-2">
          Check Your Email
        </h1>
        <p className="text-pbs-gray-500 dark:text-pbs-gray-400 leading-relaxed mb-8 max-w-sm mx-auto">
          We&apos;ve sent a verification link to your email address. Click the link to activate your account.
        </p>

        {/* Card */}
        <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 shadow-sm p-8 space-y-5">
          <div className="bg-pbs-gray-50 dark:bg-pbs-gray-800 rounded-2xl p-5">
            <div className="flex items-center justify-center gap-3 text-pbs-gray-500 dark:text-pbs-gray-400 mb-3">
              <Package className="h-5 w-5 text-pbs-red" />
              <span className="text-sm font-medium">Pack Brand Solutions</span>
            </div>
            <p className="text-xs text-pbs-gray-400 dark:text-pbs-gray-500 leading-relaxed">
              The verification email may take a few minutes to arrive. Check your spam or junk folder if you don&apos;t see it.
            </p>
          </div>

          <Button
            variant="outline"
            size="md"
            className="w-full gap-2"
            onClick={handleResend}
            disabled={resent}
          >
            <RefreshCw className="h-4 w-4" />
            {resent ? 'Email Resent!' : 'Resend Verification Email'}
          </Button>

          {resent && (
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              A new verification email has been sent.
            </p>
          )}

          <div className="pt-3 border-t border-pbs-gray-100 dark:border-pbs-gray-800">
            <p className="text-sm text-pbs-gray-500 dark:text-pbs-gray-400">
              Wrong email?{' '}
              <Link href="/signup" className="text-pbs-red font-medium hover:underline">
                Sign up again
              </Link>
            </p>
          </div>
        </div>

        <p className="text-sm text-pbs-gray-500 dark:text-pbs-gray-400 mt-6">
          Already verified?{' '}
          <Link href="/login" className="text-pbs-red font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

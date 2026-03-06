'use client';

import { createAuthClient } from 'better-auth/react';

function getBaseURL() {
  // NEXT_PUBLIC_ vars are inlined at build time
  if (process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL !== 'http://localhost:3000') {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  // In the browser, use the current origin (works on Vercel and locally)
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});

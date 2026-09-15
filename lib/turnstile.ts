import 'server-only';

/** Validate every submission on the server; tokens are single-use and short-lived. */
export async function verifyTurnstile(token: unknown, action: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || typeof token !== 'string' || !token.trim() || token.length > 2048) return false;
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(10000),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token }),
    });
    if (!response.ok) return false;
    const result = await response.json();
    return result.success === true && result.action === action;
  } catch { return false; }
}

export const turnstileError = 'Security verification failed. Please try again.';

import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { nextCookies } from 'better-auth/next-js';
import { getClient, getDb } from './db/client';
import { sendEmail } from './email';

function createAuth(db: import('mongodb').Db, client: import('mongodb').MongoClient) {
  return betterAuth({
    database: mongodbAdapter(db, { client }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      async sendResetPassword({ user, url }: { user: { email: string; name: string }; url: string }) {
        await sendEmail({
          to: user.email,
          subject: 'Reset your password — PackBrand Solutions',
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
              <h2 style="color: #1a1a1a;">Reset Your Password</h2>
              <p>Hi ${user.name},</p>
              <p>We received a request to reset your password. Click the button below to choose a new one:</p>
              <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #D32F2F; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">Reset Password</a>
              <p style="color: #666; font-size: 13px; margin-top: 24px;">If you didn't request this, you can safely ignore this email.</p>
              <p style="color: #999; font-size: 12px;">— PackBrand Solutions</p>
            </div>
          `,
        });
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      async sendVerificationEmail({ user, url }: { user: { email: string; name: string }; url: string }) {
        await sendEmail({
          to: user.email,
          subject: 'Verify your email — PackBrand Solutions',
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
              <h2 style="color: #1a1a1a;">Verify Your Email</h2>
              <p>Hi ${user.name},</p>
              <p>Thanks for signing up! Please verify your email address:</p>
              <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #D32F2F; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">Verify Email</a>
              <p style="color: #666; font-size: 13px; margin-top: 24px;">If you didn't create an account, you can safely ignore this email.</p>
              <p style="color: #999; font-size: 12px;">— PackBrand Solutions</p>
            </div>
          `,
        });
      },
    },
    user: {
      additionalFields: {
        company: { type: 'string' as const, required: false },
        phone: { type: 'string' as const, required: false },
        role: { type: 'string' as const, required: false, defaultValue: 'customer' },
      },
    },
    plugins: [nextCookies()],
  });
}

type AuthInstance = ReturnType<typeof createAuth>;

let authInstance: AuthInstance | undefined;

export async function getAuth(): Promise<AuthInstance> {
  if (authInstance) return authInstance;

  const client = await getClient();
  const db = await getDb();

  authInstance = createAuth(db, client);
  return authInstance;
}

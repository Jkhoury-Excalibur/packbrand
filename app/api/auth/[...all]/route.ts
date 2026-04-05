import { toNextJsHandler } from 'better-auth/next-js';
import { getAuth } from '@/lib/auth';
import { getDb } from '@/lib/db/client';

async function createHandler() {
  const auth = await getAuth();
  return toNextJsHandler(auth);
}

const handlerPromise = createHandler();

export async function GET(request: Request) {
  const handler = await handlerPromise;
  return handler.GET(request);
}

export async function POST(request: Request) {
  // Block staff/admin from using public password reset
  const url = new URL(request.url);
  if (url.pathname === '/api/auth/forget-password') {
    const body = await request.clone().json().catch(() => ({}));
    if (body.email) {
      const db = await getDb();
      const user = await db.collection('user').findOne({ email: body.email });
      if (user && (user.role === 'staff' || user.role === 'admin')) {
        return Response.json(
          { message: 'Password reset is not available for this account. Please contact your administrator.' },
          { status: 403 },
        );
      }
    }
  }

  const handler = await handlerPromise;
  return handler.POST(request);
}

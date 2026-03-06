import { toNextJsHandler } from 'better-auth/next-js';
import { getAuth } from '@/lib/auth';

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
  const handler = await handlerPromise;
  return handler.POST(request);
}

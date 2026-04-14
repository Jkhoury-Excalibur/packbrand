import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAuth } from './auth';

export async function getSession() {
  const auth = await getAuth();
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  return session;
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    redirect('/admin/login');
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (session.user as any).role;
  if (role !== 'admin' && role !== 'staff') {
    redirect('/admin/login');
  }
  return session;
}

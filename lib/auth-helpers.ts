import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAuth } from './auth';
import { findUser } from './db/users';

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
  const session = await requireAuth();
  // Read the current database role rather than trusting an older session snapshot.
  const user = await findUser(session.user.id);
  if (user?.role !== 'admin' || user.emailVerified !== true) redirect('/account');
  return session;
}

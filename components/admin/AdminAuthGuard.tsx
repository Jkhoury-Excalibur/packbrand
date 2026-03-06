import { requireAdmin } from '@/lib/auth-helpers';

export async function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <>{children}</>;
}

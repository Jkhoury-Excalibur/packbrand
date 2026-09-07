import { requireAdmin } from '@/lib/auth-helpers';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <div className="max-w-6xl mx-auto p-4 sm:p-8 min-h-[60vh]">{children}</div>;
}

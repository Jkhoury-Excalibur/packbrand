import { redirect } from '@/i18n/navigation';
export default async function AddressesPage({ params }: { params: Promise<{ locale: string }> }) {
  redirect({ href: '/account', locale: (await params).locale });
}

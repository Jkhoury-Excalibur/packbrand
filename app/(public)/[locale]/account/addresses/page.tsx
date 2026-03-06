import { requireAuth } from '@/lib/auth-helpers';
import { getUserAddresses } from '@/lib/db/addresses';
import { AddressesClient } from '@/components/account/AddressesClient';

export default async function AddressesPage() {
  const session = await requireAuth();
  const raw = await getUserAddresses(session.user.id);

  const addresses = raw.map((a) => ({
    id: a._id.toString(),
    type: a.type,
    isDefault: a.isDefault,
    name: a.name,
    company: a.company || '',
    line1: a.line1,
    line2: a.line2 || '',
    city: a.city,
    state: a.state,
    zip: a.zip,
    country: a.country,
    phone: a.phone || '',
  }));

  return <AddressesClient initialAddresses={addresses} />;
}

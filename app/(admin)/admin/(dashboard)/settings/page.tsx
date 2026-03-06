import { getSettings } from '@/lib/db/settings';
import { AdminSettingsClient } from '@/components/admin/AdminSettingsClient';

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <AdminSettingsClient
      settings={{
        storeName: settings.storeName,
        storeEmail: settings.storeEmail,
        storePhone: settings.storePhone,
        storeAddress: settings.storeAddress,
        currency: settings.currency,
        timezone: settings.timezone,
        notifications: settings.notifications,
      }}
    />
  );
}

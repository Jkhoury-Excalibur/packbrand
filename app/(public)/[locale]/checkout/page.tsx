import { getSettings } from '@/lib/db/settings';
import { CheckoutClient } from '@/components/checkout/CheckoutClient';

export default async function CheckoutPage() {
  const settings = await getSettings();
  return (
    <CheckoutClient
      shippingRate={settings.shippingRate ?? 49.99}
      freeShippingThreshold={settings.freeShippingThreshold ?? 500}
      taxRate={settings.taxRate ?? 0}
    />
  );
}

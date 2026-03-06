import { getSettings } from '@/lib/db/settings';
import { CartClient } from '@/components/cart/CartClient';

export default async function CartPage() {
  const settings = await getSettings();
  return (
    <CartClient
      shippingRate={settings.shippingRate ?? 49.99}
      freeShippingThreshold={settings.freeShippingThreshold ?? 500}
    />
  );
}

import { requireAuth } from '@/lib/auth-helpers';
import { findUser } from '@/lib/db/users';
import { shopifyAdmin } from '@/lib/shopify/admin';
import { loadCustomerOrders } from '@/lib/shopify/orders-data';
import { OrdersListClient } from '@/components/account/OrdersListClient';
import { Link } from '@/i18n/navigation';

export default async function AccountPage({ params, searchParams }: {
  params: Promise<{ locale: string }>; searchParams: Promise<{ after?: string }>;
}) {
  const session = await requireAuth();
  const [user, { locale }, query] = await Promise.all([findUser(session.user.id), params, searchParams]);
  const es = locale === 'es';
  if (!user?.emailVerified || typeof user.email !== 'string') return <p role="alert">{es ? 'Verifica tu correo electrónico para ver tus pedidos.' : 'Verify your email to see your orders.'}</p>;
  let result;
  try {
    result = await loadCustomerOrders(shopifyAdmin, user.email, true, query.after?.slice(0, 1000) || null);
  } catch {
    return <div className="space-y-4"><h1 className="text-3xl font-bold">{es ? 'Historial de pedidos' : 'Order history'}</h1><p role="alert">{es ? 'No pudimos cargar tus pedidos. Inténtalo de nuevo en unos momentos.' : 'We couldn’t load your orders. Please try again in a moment.'}</p><Link href="/account" className="text-pbs-red">{es ? 'Intentar de nuevo' : 'Try again'}</Link></div>;
  }
  return <div className="space-y-6">
    <div><h1 className="text-3xl font-bold">{es ? 'Historial de pedidos' : 'Order history'}</h1><p className="text-sm text-pbs-gray-500 mt-2">{es ? 'Los pedidos realizados con' : 'Orders placed with'} {user.email}. {es ? 'Usa este correo al pagar para ver tus pedidos aquí.' : 'Use this email at checkout to see your orders here.'}</p></div>
    <OrdersListClient orders={result.nodes} />
    <div className="flex gap-5 text-sm">
      {query.after && <Link href="/account">{es ? 'Pedidos más recientes' : 'Newest orders'}</Link>}
      {result.pageInfo.hasNextPage && result.pageInfo.endCursor && <Link href={{ pathname: '/account', query: { after: result.pageInfo.endCursor } }}>{es ? 'Pedidos anteriores' : 'Older orders'}</Link>}
    </div>
  </div>;
}

import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { getOrderById } from '@/lib/db/orders';
import { getSession } from '@/lib/auth-helpers';
import { InvoicePDF } from '@/lib/pdf/invoice';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Require auth
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const order = await getOrderById(id);
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  // Customers can only download their own invoices; admins can download any.
  // Guest orders (no customerId) are only accessible to admins.
  const user = session.user as { id: string; role?: string };
  if (user.role !== 'admin' && (!order.customerId || order.customerId !== user.id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const invoiceData = {
    orderNumber: order.orderNumber,
    date: new Date(order.createdAt).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    status: order.status,
    customer: {
      name: `${order.contact.firstName} ${order.contact.lastName}`,
      company: order.contact.company,
      email: order.contact.email,
      phone: order.contact.phone,
    },
    shippingAddress: order.shippingAddress,
    items: order.items,
    subtotal: order.subtotal,
    shipping: order.shipping,
    tax: order.tax ?? 0,
    total: order.total,
  };

  const buffer = await renderToBuffer(<InvoicePDF data={invoiceData} />);
  const uint8 = new Uint8Array(buffer);

  return new NextResponse(uint8, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${order.orderNumber}-invoice.pdf"`,
    },
  });
}

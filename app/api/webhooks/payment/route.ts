import { NextResponse } from 'next/server';
import { getOrderByTransactionId, updateOrderPayment } from '@/lib/db/orders';
import { verifyWebhookToken, parseWebhookPayload } from '@/lib/payment/enhanced-gateway';
import { sendEmail } from '@/lib/email';
import { escapeHtml } from '@/lib/utils/escapeHtml';

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const urlToken = url.searchParams.get('token') || '';

    // Parse payload — gateway may send JSON or form-encoded
    const contentType = request.headers.get('content-type') || '';
    let payload: Record<string, unknown>;

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.text();
      payload = Object.fromEntries(new URLSearchParams(formData));
      // Parse boolean string from form data
      if (typeof payload.TransactionResult === 'string') {
        payload.TransactionResult = payload.TransactionResult === 'true';
      }
    } else {
      payload = await request.json();
    }

    // Extract ticketId from payload (gateway uses varying casing)
    const ticketId = (payload.ticketid || payload.TicketId || payload.ticket_id ||
      payload.Ticketid) as string | undefined;

    if (!ticketId) {
      console.error('[webhook] Missing ticketid in payload:', Object.keys(payload));
      return NextResponse.json({ received: true, error: 'Missing ticket ID' });
    }

    // Look up order by transactionId
    const order = await getOrderByTransactionId(ticketId);
    if (!order) {
      console.error('[webhook] Order not found for transactionId:', ticketId);
      return NextResponse.json({ received: true, error: 'Order not found' });
    }

    // Verify HMAC token
    if (urlToken && !verifyWebhookToken(ticketId, urlToken)) {
      console.error('[webhook] Invalid HMAC token for order:', order.orderNumber);
      return NextResponse.json({ received: true, error: 'Invalid token' });
    }

    // Parse gateway response
    const result = parseWebhookPayload(payload);

    if (result.success) {
      // Idempotency: updateOrderPayment only updates if paymentStatus is still 'pending'
      const updateResult = await updateOrderPayment(ticketId, {
        paymentStatus: 'paid',
        paymentId: result.transactionId,
        paymentAuthCode: result.authCode,
        paymentMethod: result.cardType && result.lastFour
          ? { cardType: result.cardType, lastFour: result.lastFour }
          : undefined,
        paymentToken: result.token,
        paymentResponse: result.rawResponse,
      });

      if (updateResult.modifiedCount === 0) {
        // Already processed (duplicate webhook)
        return NextResponse.json({ received: true, duplicate: true });
      }

      // Send confirmation email
      const { contact } = order;
      await sendEmail({
        to: contact.email,
        subject: `Payment Confirmed — ${order.orderNumber}`,
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #1a1a1a;">Payment Confirmed!</h2>
            <p>Hi ${escapeHtml(contact.firstName)},</p>
            <p>Your payment has been processed successfully. Here are your details:</p>
            <p><strong>Order Number:</strong> ${escapeHtml(order.orderNumber)}</p>
            <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
            <p>We'll send you an update when your order ships.</p>
            <p style="color: #999; font-size: 12px;">— PackBrand Solutions</p>
          </div>
        `,
      }).catch((err) => {
        console.error('[webhook] Email send failed:', err);
      });

      console.log('[webhook] Payment successful:', order.orderNumber);
      return NextResponse.json({ success: true, orderNumber: order.orderNumber });
    } else {
      // Payment failed
      await updateOrderPayment(ticketId, {
        paymentStatus: 'failed',
        paymentResponse: result.rawResponse,
      });

      console.warn('[webhook] Payment failed:', order.orderNumber);
      return NextResponse.json({ success: false, message: 'Payment failed' });
    }
  } catch (error) {
    console.error('[webhook] Processing error:', error);
    // Always return 200 to prevent gateway retries
    return NextResponse.json({ received: true, error: 'Processing failed' });
  }
}

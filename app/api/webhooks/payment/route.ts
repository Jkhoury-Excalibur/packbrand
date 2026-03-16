import { NextResponse } from 'next/server';
import { getCartByTransactionId, markCartCompleted, markCartFailed } from '@/lib/db/carts';
import { createOrderFromCart } from '@/lib/db/orders';
import { verifyWebhookToken, parseWebhookPayload } from '@/lib/payment/enhanced-gateway';
import { sendEmail } from '@/lib/email';
import { escapeHtml } from '@/lib/utils/escapeHtml';

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const urlToken = url.searchParams.get('token') || '';

    console.log('[webhook] ===== INCOMING WEBHOOK =====');
    console.log('[webhook] URL:', request.url);
    console.log('[webhook] Method:', request.method);

    // Parse payload — gateway may send JSON or form-encoded
    const contentType = request.headers.get('content-type') || '';
    console.log('[webhook] Content-Type:', contentType);
    let payload: Record<string, unknown>;

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.text();
      console.log('[webhook] Raw form data:', formData);
      payload = Object.fromEntries(new URLSearchParams(formData));
      if (typeof payload.TransactionResult === 'string') {
        payload.TransactionResult = payload.TransactionResult === 'true';
      }
    } else {
      payload = await request.json();
    }

    console.log('[webhook] Parsed payload:', JSON.stringify(payload, null, 2));

    // Extract ticketId from payload (gateway uses varying casing)
    const ticketId = (payload.ticketid || payload.TicketId || payload.ticket_id ||
      payload.Ticketid) as string | undefined;

    console.log('[webhook] Extracted ticketId:', ticketId);

    if (!ticketId) {
      console.error('[webhook] Missing ticketid in payload:', Object.keys(payload));
      return NextResponse.json({ received: true, error: 'Missing ticket ID' });
    }

    // Look up cart by transactionId
    const cart = await getCartByTransactionId(ticketId);
    if (!cart) {
      console.error('[webhook] Cart not found for transactionId:', ticketId);
      return NextResponse.json({ received: true, error: 'Cart not found' });
    }

    console.log('[webhook] Found cart:', cart.cartId, '| status:', cart.status);

    // Idempotency: only process if cart is still in checkout state
    if (cart.status === 'completed') {
      console.log('[webhook] Already completed (duplicate webhook)');
      return NextResponse.json({ received: true, duplicate: true });
    }

    // Verify HMAC token
    if (urlToken && !verifyWebhookToken(ticketId, urlToken)) {
      console.error('[webhook] Invalid HMAC token for cart:', cart.cartId);
      return NextResponse.json({ received: true, error: 'Invalid token' });
    }

    // Parse gateway response
    const result = parseWebhookPayload(payload);
    console.log('[webhook] Parsed result:', JSON.stringify(result, null, 2));

    if (result.success) {
      // Create the real order now that payment succeeded
      const order = await createOrderFromCart(cart, {
        paymentStatus: 'paid',
        paymentId: result.transactionId,
        paymentAuthCode: result.authCode,
        paymentMethod: result.cardType && result.lastFour
          ? { cardType: result.cardType, lastFour: result.lastFour }
          : undefined,
        paymentToken: result.token,
        paymentResponse: result.rawResponse,
      });

      // Mark cart as completed with the order number
      await markCartCompleted(cart.cartId, order.orderNumber);

      // Send confirmation email
      const contact = cart.contact!;
      await sendEmail({
        to: contact.email,
        subject: `Order Confirmed — ${order.orderNumber}`,
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #1a1a1a;">Order Confirmed!</h2>
            <p>Hi ${escapeHtml(contact.firstName)},</p>
            <p>Your payment has been processed and your order is confirmed. Here are your details:</p>
            <p><strong>Order Number:</strong> ${escapeHtml(order.orderNumber)}</p>
            <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
            <p>We'll send you an update when your order ships.</p>
            <p style="color: #999; font-size: 12px;">— PackBrand Solutions</p>
          </div>
        `,
      }).catch((err) => {
        console.error('[webhook] Email send failed:', err);
      });

      console.log('[webhook] Order created:', order.orderNumber);
      return NextResponse.json({ success: true, orderNumber: order.orderNumber });
    } else {
      // Payment failed
      await markCartFailed(cart.cartId);

      console.warn('[webhook] Payment failed for cart:', cart.cartId);
      return NextResponse.json({ success: false, message: 'Payment failed' });
    }
  } catch (error) {
    console.error('[webhook] Processing error:', error);
    // Always return 200 to prevent gateway retries
    return NextResponse.json({ received: true, error: 'Processing failed' });
  }
}

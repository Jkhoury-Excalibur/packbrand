import crypto from 'crypto';
import type { PaymentInitResult, PaymentConfirmResult, RefundResult } from '../types/payment';

const PTK_URL = 'https://postransactions.com/cnp/getptk.php';
const FORM_URL = 'https://postransactions.com/cnp/cnp';
const REQUEST_URL = 'https://postransactions.com/cnp/request.php';

function getConfig() {
  const account = process.env.ENHANCED_GATEWAY_ACCOUNT;
  const apiKey = process.env.ENHANCED_GATEWAY_API_KEY;
  if (!account || !apiKey) {
    throw new Error('Missing Enhanced Gateway credentials');
  }
  return { account, apiKey };
}

/** Generate HMAC token to embed in the webhook URL for verification. */
export function generateWebhookToken(transactionId: string): string {
  const secret = process.env.WEBHOOK_SIGNING_SECRET;
  if (!secret) return '';
  return crypto
    .createHmac('sha256', secret)
    .update(transactionId)
    .digest('hex')
    .slice(0, 32);
}

/** Verify the HMAC token from the webhook URL query param. */
export function verifyWebhookToken(transactionId: string, token: string): boolean {
  const expected = generateWebhookToken(transactionId);
  if (!expected) return true; // No secret configured — skip verification
  if (expected.length !== token.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(token));
}

/** Initiate a PTK-based payment session. Returns the iframe URL. */
export async function initiatePayment(params: {
  transactionId: string;
  amount: number; // dollars
  webhookUrl: string;
  successUrl: string;
  failureUrl: string;
}): Promise<PaymentInitResult> {
  try {
    const { account, apiKey } = getConfig();

    const response = await fetch(PTK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: apiKey,
      },
      body: JSON.stringify({
        account,
        method: 'creditsale',
        amount: params.amount.toFixed(2),
        ticketid: params.transactionId,
        userid: 'ONLINE',
        paysource: 'INTERNET',
        responseurl: params.webhookUrl,
        successurl: params.successUrl,
        failureurl: params.failureUrl,
      }),
    });

    const data = await response.json();

    if (data.success && data.data?.ptk) {
      return {
        success: true,
        iframeUrl: `${FORM_URL}?ptk=${data.data.ptk}`,
        ptk: data.data.ptk,
      };
    }

    return {
      success: false,
      error: data.message || 'Failed to generate payment session',
    };
  } catch (error) {
    console.error('[enhanced-gateway] initiate error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment initialization failed',
    };
  }
}

/** Parse a webhook payload into a standard PaymentConfirmResult. */
export function parseWebhookPayload(
  payload: Record<string, unknown>,
): PaymentConfirmResult {
  return {
    success: payload.TransactionResult === true,
    transactionId: (payload.TransactionID as string) || '',
    authCode: payload.AuthCode as string | undefined,
    cardType: payload.CardType as string | undefined,
    lastFour:
      typeof payload.AccountNum === 'string'
        ? payload.AccountNum.slice(-4)
        : undefined,
    token: payload.Token as string | undefined,
    rawResponse: payload,
  };
}

/** Void a same-day transaction. */
export async function voidTransaction(
  gatewayTransactionId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { account, apiKey } = getConfig();

    const response = await fetch(REQUEST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: apiKey },
      body: JSON.stringify({
        method: 'creditvoid',
        account,
        transactionid: gatewayTransactionId,
        ticketid: 'VOID',
        userid: 'SYSTEM',
      }),
    });

    const data = await response.json();
    return {
      success: data.TransactionResult === true,
      error: data.TransactionResult !== true ? (data.Message || 'Void failed') : undefined,
    };
  } catch (error) {
    console.error('[enhanced-gateway] void error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Void failed' };
  }
}

/** Refund a transaction (partial or full). */
export async function refundTransaction(params: {
  gatewayTransactionId: string;
  amount: number; // dollars
  reason?: string;
}): Promise<RefundResult> {
  try {
    const { account, apiKey } = getConfig();

    const response = await fetch(REQUEST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: apiKey },
      body: JSON.stringify({
        method: 'creditreturn',
        account,
        transactionid: params.gatewayTransactionId,
        amount: params.amount.toFixed(2),
        ticketid: (params.reason || 'REFUND').slice(0, 15),
        userid: 'SYSTEM',
      }),
    });

    const data = await response.json();

    if (data.TransactionResult === true) {
      return {
        success: true,
        refundId: data.TransactionID || '',
        amount: params.amount,
      };
    }

    return {
      success: false,
      refundId: '',
      amount: 0,
      error: data.Message || 'Refund failed',
    };
  } catch (error) {
    console.error('[enhanced-gateway] refund error:', error);
    return {
      success: false,
      refundId: '',
      amount: 0,
      error: error instanceof Error ? error.message : 'Refund failed',
    };
  }
}

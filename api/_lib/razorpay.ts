import crypto from 'node:crypto';

export function isRazorpayConfigured(): boolean {
  const key = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  return !!(key && secret && !key.includes('your_') && !secret.includes('your_'));
}

export async function createRazorpayOrder(amountInRupees: number, receipt: string): Promise<{
  id: string;
  amount: number;
  currency: string;
  keyId: string;
} | null> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret || !isRazorpayConfigured()) {
    return null;
  }

  const amountInPaise = Math.round(amountInRupees * 100);
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: 'INR',
      receipt: receipt.slice(0, 40),
      payment_capture: 1
    })
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Razorpay order creation failed:', errorText);
    return null;
  }

  const data = await res.json();
  return {
    id: data.id,
    amount: data.amount,
    currency: data.currency,
    keyId
  };
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return false;

  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
}

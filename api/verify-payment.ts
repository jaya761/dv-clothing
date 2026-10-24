import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyRazorpaySignature, isRazorpayConfigured } from './_lib/razorpay';
import { getSupabaseAdmin } from './_lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { orderNumber, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body || {};

  if (!orderNumber || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return res.status(400).json({
      success: false,
      error: 'Missing required payment verification parameters'
    });
  }

  if (!isRazorpayConfigured()) {
    return res.status(400).json({
      success: false,
      error: 'Razorpay credentials not configured on the server. Cannot cryptographically verify signature.'
    });
  }

  // Cryptographic signature check
  const isValid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
  if (!isValid) {
    return res.status(400).json({
      success: false,
      error: 'Invalid payment signature. Verification failed.'
    });
  }

  const { supabase, isConfigured } = getSupabaseAdmin();
  if (isConfigured && supabase) {
    try {
      // Check existing payment to prevent duplicates
      const { data: existingPayment } = await supabase
        .from('payments')
        .select('id')
        .eq('razorpay_payment_id', razorpayPaymentId)
        .maybeSingle();

      if (existingPayment) {
        return res.status(200).json({
          success: true,
          message: 'Payment already processed and recorded.'
        });
      }

      // Update order status to 'paid'
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          updated_at: new Date().toISOString()
        })
        .eq('order_number', orderNumber)
        .select('id, total_amount')
        .single();

      if (orderErr || !order) {
        return res.status(404).json({
          success: false,
          error: 'Order not found for updating payment status.'
        });
      }

      // Record in payments table
      await supabase.from('payments').insert({
        order_id: order.id,
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
        amount: order.total_amount,
        currency: 'INR',
        status: 'captured'
      });

      return res.status(200).json({
        success: true,
        message: 'Payment verified and captured successfully.'
      });
    } catch (err: unknown) {
      return res.status(500).json({
        success: false,
        error: err instanceof Error ? err.message : 'Database error during payment recording.'
      });
    }
  }

  return res.status(200).json({
    success: true,
    message: 'Signature verified.'
  });
}

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateAdminRequest } from '../_lib/auth';
import { getSupabaseAdmin } from '../_lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth = authenticateAdminRequest(req);
  if (!auth.authenticated) {
    return res.status(401).json({ error: 'Unauthorized admin request' });
  }

  const { supabase, isConfigured } = getSupabaseAdmin();
  if (!isConfigured || !supabase) {
    return res.status(200).json({
      success: false,
      orders: [],
      message: 'Supabase is not configured yet.'
    });
  }

  // 1. GET ORDERS
  if (req.method === 'GET') {
    const { status, limit } = req.query;
    try {
      let query = supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('order_status', String(status));
      }
      if (limit) {
        query = query.limit(Number(limit));
      }

      const { data, error } = await query;
      if (error) return res.status(500).json({ error: error.message });

      return res.status(200).json({ success: true, orders: data });
    } catch (err: unknown) {
      return res.status(500).json({ error: err instanceof Error ? err.message : 'Database error' });
    }
  }

  // 2. PATCH (UPDATE ORDER STATUS / TRACKING)
  if (req.method === 'PATCH') {
    const { orderId, orderStatus, paymentStatus, trackingNumber, courierPartner } = req.body || {};

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    try {
      const updates: any = { updated_at: new Date().toISOString() };
      if (orderStatus) updates.order_status = orderStatus;
      if (paymentStatus) updates.payment_status = paymentStatus;
      if (trackingNumber !== undefined) updates.tracking_number = trackingNumber;
      if (courierPartner !== undefined) updates.courier_partner = courierPartner;

      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId)
        .select()
        .single();

      if (error) return res.status(500).json({ error: error.message });

      return res.status(200).json({ success: true, order: data });
    } catch (err: unknown) {
      return res.status(500).json({ error: err instanceof Error ? err.message : 'Database error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

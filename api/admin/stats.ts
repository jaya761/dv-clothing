import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateAdminRequest } from '../_lib/auth';
import { getSupabaseAdmin } from '../_lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = authenticateAdminRequest(req);
  if (!auth.authenticated) {
    return res.status(401).json({ error: 'Unauthorized admin request' });
  }

  const { supabase, isConfigured } = getSupabaseAdmin();
  if (isConfigured && supabase) {
    try {
      const [ordersRes, productsRes, printsRes] = await Promise.all([
        supabase.from('orders').select('id, total_amount, payment_status, order_status, created_at'),
        supabase.from('products').select('id, is_active, stock_quantity'),
        supabase.from('custom_designs').select('id, created_at')
      ]);

      const orders = ordersRes.data || [];
      const totalRevenue = orders
        .filter((o) => o.payment_status === 'paid' || o.order_status !== 'cancelled')
        .reduce((sum, o) => sum + Number(o.total_amount), 0);

      const pendingOrders = orders.filter((o) => o.order_status === 'confirmed' || o.order_status === 'in_production').length;
      const totalProducts = (productsRes.data || []).length;
      const totalCustomPrints = (printsRes.data || []).length;

      return res.status(200).json({
        success: true,
        stats: {
          totalRevenue,
          totalOrders: orders.length,
          pendingOrders,
          totalProducts,
          totalCustomPrints,
          recentOrders: orders.slice(0, 5)
        }
      });
    } catch (err: unknown) {
      return res.status(500).json({ error: err instanceof Error ? err.message : 'Database error' });
    }
  }

  // Preview Mode Mock Stats
  return res.status(200).json({
    success: true,
    stats: {
      totalRevenue: 48990,
      totalOrders: 28,
      pendingOrders: 6,
      totalProducts: 6,
      totalCustomPrints: 12,
      isDemoMode: true
    }
  });
}

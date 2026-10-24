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
  if (!isConfigured || !supabase) {
    return res.status(200).json({
      success: true,
      customPrints: [],
      message: 'Supabase is not configured yet.'
    });
  }

  try {
    const { data, error } = await supabase
      .from('custom_designs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true, customPrints: data });
  } catch (err: unknown) {
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Database error' });
  }
}

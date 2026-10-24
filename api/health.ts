import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseAdmin } from './_lib/supabase';
import { isRazorpayConfigured } from './_lib/razorpay';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { supabase, isConfigured: isSupabaseConfigured } = getSupabaseAdmin();
  let dbConnected = false;
  let dbMessage = 'Supabase environment variables not configured';

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('site_settings').select('key').limit(1);
      if (error) {
        dbMessage = `Database query error: ${error.message}`;
      } else {
        dbConnected = true;
        dbMessage = 'Connected to Supabase PostgreSQL';
      }
    } catch (err: unknown) {
      dbMessage = `Database connection failed: ${err instanceof Error ? err.message : 'Unknown'}`;
    }
  }

  const razorpayConfigured = isRazorpayConfigured();

  return res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'DV CLOTHING API',
    database: {
      configured: isSupabaseConfigured,
      connected: dbConnected,
      message: dbMessage
    },
    paymentGateway: {
      provider: 'Razorpay',
      configured: razorpayConfigured,
      status: razorpayConfigured ? 'Ready' : 'Pending credentials configuration'
    }
  });
}

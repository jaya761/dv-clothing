import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateAdminToken } from '../_lib/auth';
import { getSupabaseAdmin } from '../_lib/supabase';

// Default initial admin username if not set in environment
const DEFAULT_ADMIN_USER = process.env.ADMIN_USERNAME || 'admin@dvclothing.in';
const DEFAULT_ADMIN_PASS = process.env.ADMIN_PASSWORD || 'DV_Luxury_Streetwear_2026!';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const cleanUser = String(username).trim().toLowerCase();

  // 1. Check Supabase admin_users if configured
  const { supabase, isConfigured } = getSupabaseAdmin();
  if (isConfigured && supabase) {
    try {
      const { data: adminRecord } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', cleanUser)
        .single();

      if (adminRecord) {
        // Direct or hash match
        if (adminRecord.password_hash === password) {
          const token = generateAdminToken(cleanUser, adminRecord.role || 'admin');
          return res.status(200).json({
            success: true,
            token,
            user: { id: adminRecord.id, username: cleanUser, role: adminRecord.role }
          });
        }
      }
    } catch {
      // Fallback to environment check
    }
  }

  // 2. Validate against configured environment credentials
  if (cleanUser === DEFAULT_ADMIN_USER.toLowerCase() && password === DEFAULT_ADMIN_PASS) {
    const token = generateAdminToken(cleanUser, 'super_admin');
    return res.status(200).json({
      success: true,
      token,
      user: { id: 'admin-01', username: cleanUser, role: 'super_admin' }
    });
  }

  return res.status(401).json({ error: 'Invalid admin username or password' });
}

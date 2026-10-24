import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): { supabase: SupabaseClient | null; isConfigured: boolean } {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey || url.includes('your-project') || serviceKey.includes('your-service-key')) {
    return { supabase: null, isConfigured: false };
  }

  if (!cachedClient) {
    cachedClient = createClient(url, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  }

  return { supabase: cachedClient, isConfigured: true };
}

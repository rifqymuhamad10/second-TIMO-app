/**
 * supabaseAdmin.ts
 * 
 * Client Supabase server-side yang menggunakan service_role key.
 * Dipakai HANYA di server (API routes, server actions).
 * Service_role key bypass Row Level Security (RLS).
 * 
 * JANGAN import file ini di komponen client-side!
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    '[supabaseAdmin] Missing environment variables. ' +
    'Pastikan NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY sudah diset di .env.local'
  );
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

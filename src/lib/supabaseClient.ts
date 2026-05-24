import { createClient } from '@supabase/supabase-js';
import { RealtimeClient } from '@supabase/realtime-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Warning: Supabase credentials are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
  );
}

// Client standard Supabase (termasuk modul database, auth, storage, dan realtime bawaan)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Boilerplate untuk Realtime Client terpisah jika dibutuhkan subskripsi custom socket/channel
export const getRealtimeClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return new RealtimeClient(supabaseUrl, {
    params: {
      apikey: supabaseAnonKey,
    },
  });
};

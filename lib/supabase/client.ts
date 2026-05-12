import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!url || !key) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

/**
 * Browser-side Supabase client.
 * Safe to import from client components — uses the public anon key.
 * Singleton pattern prevents multiple instances.
 * Note: untyped client; service layer enforces types at its boundaries.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = createClient(url, key);

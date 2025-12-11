import { createClient } from '@supabase/supabase-js';

// Access environment variables via Vite's import.meta.env
// Support both VITE_ and NEXT_PUBLIC_ prefixes for compatibility
const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
  '';

const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  '';

// Create the client only if keys are present
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const isSupabaseConfigured = () => {
    const hasConfig = !!supabase;
    if (!hasConfig) {
        console.warn("Supabase is not configured. Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.");
        console.warn("Available env vars:", {
          hasViteUrl: !!import.meta.env.VITE_SUPABASE_URL,
          hasNextPublicUrl: !!import.meta.env.NEXT_PUBLIC_SUPABASE_URL,
          hasViteKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
          hasNextPublicKey: !!import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        });
    }
    return hasConfig;
};

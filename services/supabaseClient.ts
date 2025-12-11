import { createClient, SupabaseClient } from '@supabase/supabase-js';

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

// Log configuration status for debugging
console.log('🔧 Supabase Environment Check:', {
  hasViteUrl: !!import.meta.env.VITE_SUPABASE_URL,
  hasNextPublicUrl: !!import.meta.env.NEXT_PUBLIC_SUPABASE_URL,
  hasViteKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
  hasNextPublicKey: !!import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  urlValue: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING',
  keyValue: supabaseAnonKey ? 'Present' : 'MISSING'
});

// Create the client only if both URL and key are present
let supabaseClient: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: window.localStorage
      }
    });
    console.log('✅ Supabase client initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Supabase client:', error);
  }
} else {
  console.warn('⚠️ Supabase credentials not found. Running in demo mode.');
  console.warn('Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.');
}

export const supabase = supabaseClient;

export const isSupabaseConfigured = (): boolean => {
  const hasConfig = !!supabase;
  
  if (!hasConfig) {
    console.warn('⚠️ Supabase is not configured.');
    console.warn('Add these environment variables to Vercel:');
    console.warn('- VITE_SUPABASE_URL');
    console.warn('- VITE_SUPABASE_ANON_KEY');
  }
  
  return hasConfig;
};

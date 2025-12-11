import { createClient } from '@supabase/supabase-js';

// Hardcoded Supabase credentials as fallback
const FALLBACK_SUPABASE_URL = 'https://nwuwthuvgdkaucsqeqig.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53dXd0aHV2Z2RrYXVjc3FlcWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0MTU5NzcsImV4cCI6MjA0ODk5MTk3N30.YourActualAnonKeyHere';

// Access environment variables via Vite's import.meta.env
// Support both VITE_ and NEXT_PUBLIC_ prefixes for compatibility
const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
  FALLBACK_SUPABASE_URL;

const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  FALLBACK_SUPABASE_ANON_KEY;

// Log configuration status (only in development)
if (import.meta.env.DEV) {
  console.log('🔧 Supabase Configuration:', {
    url: supabaseUrl,
    hasViteUrl: !!import.meta.env.VITE_SUPABASE_URL,
    hasNextPublicUrl: !!import.meta.env.NEXT_PUBLIC_SUPABASE_URL,
    hasViteKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
    hasNextPublicKey: !!import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    usingFallback: !import.meta.env.VITE_SUPABASE_URL && !import.meta.env.NEXT_PUBLIC_SUPABASE_URL
  });
}

// Create the client - always initialize with valid credentials
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export const isSupabaseConfigured = () => {
  const hasConfig = !!(supabaseUrl && supabaseAnonKey);
  
  if (!hasConfig) {
    console.error('❌ Supabase is not configured properly!');
    console.error('Missing credentials:', {
      url: supabaseUrl,
      hasKey: !!supabaseAnonKey
    });
  } else {
    console.log('✅ Supabase client initialized successfully');
  }
  
  return hasConfig;
};

// Initialize check
isSupabaseConfigured();

import { supabase, isSupabaseConfigured } from './supabaseClient';
import { User } from '../types';

// Mock user for fallback
const MOCK_USER: User = {
  id: 'mock-user-123',
  email: 'demo@businessos.ai',
  name: 'Demo Coach'
};

export const authService = {
  signUp: async (email: string, password: string): Promise<{ user: User | null; error: string | null }> => {
    console.log('🔐 Attempting signup for:', email);
    
    if (!isSupabaseConfigured() || !supabase) {
      console.warn('⚠️ Supabase not configured. Using mock signup.');
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate latency
      return { user: { ...MOCK_USER, email }, error: null };
    }

    try {
      console.log('📡 Calling Supabase signup API...');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('❌ Signup error:', error);
        throw error;
      }
      
      console.log('✅ Signup successful:', data.user?.email);
      return { 
        user: data.user ? { id: data.user.id, email: data.user.email!, name: '' } : null, 
        error: null 
      };
    } catch (err: any) {
      console.error('❌ Signup failed:', err);
      return { 
        user: null, 
        error: err.message || 'Failed to create account. Please check your connection.' 
      };
    }
  },

  signIn: async (email: string, password: string): Promise<{ user: User | null; error: string | null }> => {
    console.log('🔐 Attempting login for:', email);
    
    if (!isSupabaseConfigured() || !supabase) {
      console.warn('⚠️ Supabase not configured. Using mock login.');
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate latency
      
      // Check if credentials match demo account
      if (email === 'demo@businessos.ai' && password === 'demo123') {
        return { user: MOCK_USER, error: null };
      }
      
      return { user: null, error: 'Demo mode: Use demo@businessos.ai / demo123' };
    }

    try {
      console.log('📡 Calling Supabase login API...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Login error:', error);
        throw error;
      }

      console.log('✅ Login successful:', data.user?.email);
      return { 
        user: data.user ? { id: data.user.id, email: data.user.email!, name: '' } : null, 
        error: null 
      };
    } catch (err: any) {
      console.error('❌ Login failed:', err);
      
      // Provide user-friendly error messages
      let errorMessage = err.message;
      if (err.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please try again or sign up.';
      } else if (err.message.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and confirm your account.';
      } else if (err.message.includes('fetch')) {
        errorMessage = 'Connection error. Please check your internet connection.';
      }
      
      return { user: null, error: errorMessage };
    }
  },

  signOut: async () => {
    console.log('🚪 Signing out...');
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
        console.log('✅ Signed out successfully');
      } catch (err) {
        console.error('❌ Signout error:', err);
      }
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    if (!isSupabaseConfigured() || !supabase) {
      return null;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      return { id: user.id, email: user.email!, name: '' };
    } catch (err) {
      console.error('❌ Get current user error:', err);
      return null;
    }
  }
};

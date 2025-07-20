import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging for development
const isDev = import.meta.env.DEV;

if (isDev) {
  console.log('🔗 Supabase Connection:', {
    url: supabaseUrl,
    hasKey: !!supabaseAnonKey,
    timestamp: new Date().toISOString()
  });
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce'
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-client-info': 'solvendo-backoffice@1.0.0'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Add connection monitoring for development
if (isDev) {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔐 Auth Event:', event, session?.user?.email || 'No user');
  });
}
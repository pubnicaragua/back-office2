import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔗 Supabase Connection:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
  timestamp: new Date().toISOString()
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'implicit'
  },
  db: {
    schema: 'public',
    timeout: 10000
  },
  global: {
    headers: {
      'x-client-info': 'solvendo-backoffice@1.0.0',
      'Cache-Control': 'no-cache'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 5
    }
  }
});

// Add connection monitoring
supabase.auth.onAuthStateChange((event, session) => {
  console.log('🔐 Auth Event:', event, session?.user?.email || 'No user');
});

// Test connection on startup
const testConnection = async () => {
  const start = Date.now();
  try {
    const { data, error } = await supabase.from('empresas').select('id').limit(1);
    const duration = Date.now() - start;
    console.log(`✅ Supabase Test: ${duration}ms`, { success: !error, records: data?.length || 0 });
  } catch (err) {
    console.error('❌ Supabase Test Failed:', err);
  }
};

testConnection();
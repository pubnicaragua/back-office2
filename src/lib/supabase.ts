import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Supabase Config Check:');
console.log('URL:', supabaseUrl ? '✅ Present' : '❌ Missing');
console.log('Key:', supabaseAnonKey ? '✅ Present' : '❌ Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase configuration missing!');
  console.error('URL:', supabaseUrl);
  console.error('Key:', supabaseAnonKey);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

// Test connection and check tables
const testConnection = async () => {
  try {
    console.log('🔄 Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase.from('usuarios').select('count').limit(1);
    
    if (error) {
      console.error('❌ Connection test failed:', error);
      
      // Try alternative table
      const { data: usersData, error: usersError } = await supabase.from('users').select('count').limit(1);
      if (usersError) {
        console.error('❌ Users table also failed:', usersError);
      } else {
        console.log('✅ Users table accessible');
      }
    } else {
      console.log('✅ Usuarios table accessible');
    }
    
    // Check auth configuration
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error('❌ Auth check failed:', authError);
    } else {
      console.log('✅ Auth system accessible');
    }
    
  } catch (err) {
    console.error('❌ Connection test error:', err);
  }
};

// Run test after a short delay to ensure everything is loaded
setTimeout(testConnection, 1000);
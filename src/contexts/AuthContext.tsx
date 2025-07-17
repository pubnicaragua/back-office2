import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 AuthProvider: Initializing...');
    
    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log('🔍 Checking initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          console.log('✅ Found existing session for user:', session.user.email);
          await fetchUserProfile(session.user.id, session.user.email);
        } else {
          console.log('ℹ️ No existing session found');
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id, session.user.email);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      console.log('🧹 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string, userEmail?: string) => {
    try {
      console.log('🔍 Fetching user profile for:', userId);
      setLoading(true);
      
      // Set a timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database query timeout')), 10000);
      });

      // Try usuarios table first with timeout
      const usuarioPromise = supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single();

      try {
        const { data: usuarioData, error: usuarioError } = await Promise.race([
          usuarioPromise,
          timeoutPromise
        ]) as any;

        if (usuarioData && !usuarioError) {
          console.log('✅ Found user in usuarios table:', usuarioData.email);
          setUser(usuarioData);
          setLoading(false);
          return;
        }
      } catch (timeoutError) {
        console.log('⏰ Database query timed out, creating fallback user');
      }

      console.log('ℹ️ Creating fallback user profile...');
      
      // Create basic user object from auth data
      const basicUser: User = {
        id: userId,
        email: userEmail || 'usuario@ejemplo.com',
        nombres: 'Usuario',
        apellidos: '',
        rut: '',
        telefono: '',
        direccion: '',
        activo: true,
        created_at: new Date().toISOString()
      };

      console.log('✅ Created fallback user profile for:', basicUser.email);
      setUser(basicUser);
      setLoading(false);

      // Try to create the user in the database in the background
      setTimeout(async () => {
        try {
          console.log('🔄 Background: Attempting to upsert user record...');
          const { error: upsertError } = await supabase
            .from('usuarios')
            .upsert({
              id: userId,
              email: userEmail || 'usuario@ejemplo.com',
              nombres: 'Usuario',
              apellidos: '',
              activo: true
            }, {
              onConflict: 'id'
            });

          if (upsertError) {
            console.log('ℹ️ Background: Could not upsert user record:', upsertError.message);
          } else {
            console.log('✅ Background: User record upserted successfully');
          }
        } catch (bgError) {
          console.log('ℹ️ Background: Database upsert failed:', bgError);
        }
      }, 1000);

    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
      
      // Always create a fallback user to prevent infinite loading
      const fallbackUser: User = {
        id: userId,
        email: userEmail || 'usuario@ejemplo.com',
        nombres: 'Usuario',
        apellidos: '',
        rut: '',
        telefono: '',
        direccion: '',
        activo: true,
        created_at: new Date().toISOString()
      };
      
      console.log('🆘 Using emergency fallback user profile');
      setUser(fallbackUser);
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔄 Attempting sign in for:', email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Sign in error:', error);
        setLoading(false);
        throw error;
      }
      
      console.log('✅ Sign in successful for:', email);
      // Don't set loading to false here - let the auth state change handle it
    } catch (error) {
      console.error('❌ Sign in failed:', error);
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('🔄 Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Sign out error:', error);
        throw error;
      }
      console.log('✅ Sign out successful');
    } catch (error) {
      console.error('❌ Sign out failed:', error);
      throw error;
    }
  };

  const value = React.useMemo(() => ({
    user,
    loading,
    signIn,
    signOut
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
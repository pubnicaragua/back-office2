import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Debug logging for development
const isDev = import.meta.env.DEV;

export function useSupabaseData<T>(
  table: string,
  select: string = '*',
  filters?: Record<string, any>
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [table, select, JSON.stringify(filters)]);

  const fetchData = async () => {
    const startTime = Date.now();
    
    try {
      setLoading(true);
      setError(null);
      
      if (isDev) {
        console.log(`📊 Fetching ${table}:`, { select, filters });
      }
      
      let query = supabase.from(table).select(select);
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      
      const { data: result, error } = await query;
      
      const duration = Date.now() - startTime;
      
      if (isDev) {
        console.log(`✅ ${table} loaded:`, {
          records: result?.length || 0,
          duration: `${duration}ms`,
          error: error?.message
        });
      }
      
      if (error) {
        setError(error.message);
        setData([]);
      } else {
        const finalData = result || [];
        setData(finalData);
      }
    } catch (err: any) {
      if (isDev) {
        console.error(`❌ ${table} error:`, err.message);
      }
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    if (isDev) {
      console.log(`🔄 Refetching ${table}`);
    }
    fetchData();
  };

  return { data, loading, error, refetch };
}

export function useSupabaseInsert<T>(table: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const insert = async (data: Partial<T>) => {
    const startTime = Date.now();
    
    try {
      setLoading(true);
      setError(null);
      
      if (isDev) {
        console.log(`📝 Inserting into ${table}:`, data);
      }
      
      const { error } = await supabase.from(table).insert(data);
      
      const duration = Date.now() - startTime;
      
      if (isDev) {
        console.log(`✅ Insert ${table}:`, {
          success: !error,
          duration: `${duration}ms`,
          error: error?.message
        });
      }
      
      if (error) {
        setError(error.message);
        return false;
      }
      return true;
    } catch (err: any) {
      if (isDev) {
        console.error(`❌ Insert ${table} error:`, err.message);
      }
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { insert, loading, error };
}

export function useSupabaseUpdate<T>(table: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (id: string, data: Partial<T>) => {
    const startTime = Date.now();
    
    try {
      setLoading(true);
      setError(null);
      
      if (isDev) {
        console.log(`✏️ Updating ${table}:`, { id, data });
      }
      
      const { error } = await supabase.from(table).update(data).eq('id', id);
      
      const duration = Date.now() - startTime;
      
      if (isDev) {
        console.log(`✅ Update ${table}:`, {
          success: !error,
          duration: `${duration}ms`,
          error: error?.message
        });
      }
      
      if (error) {
        setError(error.message);
        return false;
      }
      return true;
    } catch (err: any) {
      if (isDev) {
        console.error(`❌ Update ${table} error:`, err.message);
      }
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}
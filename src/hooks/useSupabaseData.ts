import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Cache para evitar consultas repetidas
const queryCache = new Map();
const CACHE_DURATION = 10000; // 10 segundos para mejor performance

export function useSupabaseData<T>(
  table: string,
  select: string = '*',
  filters?: Record<string, any>
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Crear clave de cache
  const cacheKey = `${table}-${select}-${JSON.stringify(filters)}`;

  useEffect(() => {
    // Verificar cache primero
    const cached = queryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setData(cached.data);
      setLoading(false);
      return;
    }

    fetchData();
  }, [table, select, JSON.stringify(filters), cacheKey]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase.from(table).select(select);
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      
      const { data: result, error } = await query;
      
      if (error) {
        setError(error.message);
        setData([]); // Set empty array on error
      } else {
        const finalData = result || [];
        setData(finalData);
        
        // Guardar en cache
        queryCache.set(cacheKey, {
          data: finalData,
          timestamp: Date.now()
        });
      }
    } catch (err: any) {
      setError(err.message);
      setData([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    // Limpiar cache al refetch
    queryCache.delete(cacheKey);
    fetchData();
  };

  return { data, loading, error, refetch };
}

export function useSupabaseInsert<T>(table: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const insert = async (data: Partial<T>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.from(table).insert(data);
      
      if (error) {
        setError(error.message);
        return false;
      }
      return true;
    } catch (err: any) {
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
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.from(table).update(data).eq('id', id);
      
      if (error) {
        setError(error.message);
        return false;
      }
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
        console.error(`Error fetching ${table}:`, error);
        setError(error.message);
        setData([]); // Set empty array on error
      } else {
        setData(result || []);
      }
    } catch (err: any) {
      console.error(`Error fetching ${table}:`, err);
      setError(err.message);
      setData([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => fetchData();

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
        console.error(`Error inserting into ${table}:`, error);
        setError(error.message);
        return false;
      }
      return true;
    } catch (err: any) {
      console.error(`Error inserting into ${table}:`, err);
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
        console.error(`Error updating ${table}:`, error);
        setError(error.message);
        return false;
      }
      return true;
    } catch (err: any) {
      console.error(`Error updating ${table}:`, err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}
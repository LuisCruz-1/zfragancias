import { useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import type { Database } from '../../../types/database.types';

type Perfume = Database['public']['Tables']['perfumes']['Row'];
type InsertPerfume = Omit<Perfume, 'id' | 'created_at'>;

export const usePerfumes = () => {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPerfumes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('perfumes')
        .select('*')
        .order('nombre', { ascending: true });

      if (error) throw error;
      setPerfumes(data || []);
    } catch (err: any) {
      setError(err.message || 'Error al obtener perfumes');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPerfume = async (perfume: InsertPerfume) => {
    try {
      const { data, error } = await supabase
        .from('perfumes')
        .insert([perfume])
        .select()
        .single();
      
      if (error) throw error;
      setPerfumes((prev) => [...prev, data].sort((a, b) => a.nombre.localeCompare(b.nombre)));
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  const updatePerfume = async (id: string, updates: Partial<InsertPerfume>) => {
    try {
      const { data, error } = await supabase
        .from('perfumes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setPerfumes((prev) => prev.map((p) => p.id === id ? data : p));
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  return {
    perfumes,
    loading,
    error,
    fetchPerfumes,
    createPerfume,
    updatePerfume
  };
};

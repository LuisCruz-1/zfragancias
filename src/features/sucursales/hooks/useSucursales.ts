import { useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import type { Database } from '../../../types/database.types';

type Sucursal = Database['public']['Tables']['sucursales']['Row'] & {
  responsable?: { nombre: string; apellido: string } | null;
};

export const useSucursales = () => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSucursales = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sucursales')
        .select(`
          *,
          responsable:usuarios!responsable_id(nombre, email)
        `)
        .order('nombre', { ascending: true });

      if (error) throw error;
      setSucursales(data as any);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const crearSucursal = async (sucursal: Omit<Sucursal, 'id' | 'created_at' | 'responsable_id'>) => {
    try {
      const { error } = await supabase.from('sucursales').insert([sucursal]);
      if (error) throw error;
      await fetchSucursales();
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  return {
    sucursales,
    loading,
    error,
    fetchSucursales,
    crearSucursal
  };
};
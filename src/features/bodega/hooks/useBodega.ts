import { useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import type { Database } from '../../../types/database.types';

type BodegaStock = Database['public']['Tables']['bodega_stock']['Row'];
type Perfume = Database['public']['Tables']['perfumes']['Row'];

export type BodegaStockWithPerfume = BodegaStock & {
  perfume?: { nombre: string; codigo_unico: string; marca: string } | null;
};

export type InsertBodegaStock = Database['public']['Tables']['bodega_stock']['Insert'];

export const useBodega = () => {
  const [stock, setStock] = useState<BodegaStockWithPerfume[]>([]);
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStock = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('bodega_stock')
        .select(`
          *,
          perfume:perfumes(nombre, codigo_unico, marca)
        `)
        .order('fecha_llegada', { ascending: false });

      if (error) throw error;
      setStock((data as unknown) as BodegaStockWithPerfume[] || []);
    } catch (err: any) {
      setError(err.message || 'Error al obtener stock de bodega');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchActivePerfumes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('perfumes')
        .select('*')
        .eq('activo', true)
        .order('nombre', { ascending: true });

      if (error) throw error;
      setPerfumes(data || []);
    } catch (err: any) {
      console.error('Error al obtener perfumes activos:', err);
    }
  }, []);

  const ingresarMercaderia = async (nuevoLote: InsertBodegaStock) => {
    try {
      const { error } = await supabase
        .from('bodega_stock')
        .insert([nuevoLote]);
      
      if (error) throw error;
      
      await fetchStock(); // Recargamos para traer el join con perfume
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  return {
    stock,
    perfumes,
    loading,
    error,
    fetchStock,
    fetchActivePerfumes,
    ingresarMercaderia
  };
};

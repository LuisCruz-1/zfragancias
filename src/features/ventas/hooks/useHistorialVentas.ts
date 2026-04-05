import { useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';

export const useHistorialVentas = () => {
  const [ventas, setVentas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVentas = useCallback(async (filtros?: any) => {
    setLoading(true);
    try {
      let query = supabase
        .from('ventas')
        .select(`
          *,
          usuarios!vendedor_id(nombre),
          clientes(nombre),
          sucursales(nombre)
        `)
        .order('created_at', { ascending: false });

      if (filtros) {
        if (filtros.sucursalId) query = query.eq('sucursal_id', filtros.sucursalId);
        if (filtros.estado) query = query.eq('estado', filtros.estado);
        if (filtros.fechaInicio) query = query.gte('created_at', filtros.fechaInicio);
        if (filtros.fechaFin) {
          const endOfDay = filtros.fechaFin.includes('T') ? filtros.fechaFin : `${filtros.fechaFin}T23:59:59.999Z`;
          query = query.lte('created_at', endOfDay);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      setVentas(data || []);
    } catch (error) {
      console.error('Error fetching ventas:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const anularVenta = async (ventaId: string) => {
    try {
      const { error } = await supabase.rpc('fn_anular_venta', { p_venta_id: ventaId });
      if (error) throw error;
      setVentas(prev => prev.map(v => v.id === ventaId ? { ...v, estado: 'anulada' } : v));
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const fetchDetalleVenta = async (ventaId: string) => {
    try {
      const [itemsRes, pagosRes] = await Promise.all([
        supabase.from('venta_items').select('*, perfumes(nombre, marca)').eq('venta_id', ventaId),
        supabase.from('venta_pagos').select('*').eq('venta_id', ventaId)
      ]);
      return { items: itemsRes.data, pagos: pagosRes.data };
    } catch (error) {
      return { items: null, pagos: null, error };
    }
  };

  return { ventas, loading, fetchVentas, anularVenta, fetchDetalleVenta };
};

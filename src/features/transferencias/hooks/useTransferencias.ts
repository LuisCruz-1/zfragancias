import { useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';
import type { Database } from '../../../types/database.types';

type Transferencia = Database['public']['Tables']['transferencias']['Row'] & {
  destino?: { nombre: string } | null;
  creador?: { nombre: string } | null;
};

type TransferenciaItem = Database['public']['Tables']['transferencia_items']['Row'] & {
  perfume?: { nombre: string; marca: string; codigo_unico: string } | null;
  bodega_stock?: { codigo_lote: string } | null;
};

type Sucursal = Database['public']['Tables']['sucursales']['Row'];

export const useTransferencias = () => {
  const { userProfile } = useAuth();
  const [transferencias, setTransferencias] = useState<Transferencia[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTransferencias = useCallback(async () => {
    setLoading(true);
    try {
      // Si es administrador ve todas, si es gerente o responsable ve solo las de su sucursal
      let query = supabase
        .from('transferencias')
        .select(`
          *,
          destino:sucursales!destino_id(nombre),
          creador:usuarios!creado_por(nombre)
        `)
        .order('created_at', { ascending: false });

      if (userProfile?.rol?.nombre !== 'admin' && userProfile?.sucursal_id) {
        query = query.eq('destino_id', userProfile.sucursal_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      setTransferencias((data as unknown) as Transferencia[]);
    } catch (err) {
      console.error('Error fetching transferencias:', err);
    } finally {
      setLoading(false);
    }
  }, [userProfile]);

  const fetchSucursales = useCallback(async () => {
    const { data } = await supabase.from('sucursales').select('*').eq('activa', true);
    setSucursales(data || []);
  }, []);

  const fetchDetalle = async (transferencia_id: string): Promise<TransferenciaItem[]> => {
    const { data, error } = await supabase
      .from('transferencia_items')
      .select(`
        *,
        perfume:perfumes(nombre, marca, codigo_unico),
        bodega_stock:bodega_stock(codigo_lote)
      `)
      .eq('transferencia_id', transferencia_id);
    if (error) {
      console.error(error);
      return [];
    }
    return (data as unknown) as TransferenciaItem[];
  };

  const getStockDisponible = async () => {
    const { data } = await supabase
      .from('bodega_stock')
      .select(`
        id, perfume_id, codigo_lote, cantidad_disponible,
        perfumes(nombre, marca)
      `)
      .gt('cantidad_disponible', 0);
    return data || [];
  };

  const crearTransferencia = async (destino_id: string, notas: string, items: any[]) => {
    if (!userProfile?.id) return { error: 'Usuario no autenticado' };

    try {
      // 1. Crear registro maestro
      const { data: trans, error: errTrans } = await supabase
        .from('transferencias')
        .insert([{
          origen_tipo: 'bodega',
          origen_id: null,
          destino_id,
          estado: 'en_transito', // O pendiente dependiendo el negocio, asumimos en tránsito directo
          notas,
          creado_por: userProfile.id
        }])
        .select()
        .single();

      if (errTrans) throw errTrans;

      // 2. Insertar items y reservar stock (RPC)
      for (const item of items) {
        // Insert item
        const { error: errItem } = await supabase
          .from('transferencia_items')
          .insert([{
            transferencia_id: trans.id,
            bodega_stock_id: item.bodega_stock_id,
            perfume_id: item.perfume_id,
            cantidad_solicitada: item.cantidad,
            cantidad_enviada: item.cantidad
          }]);
        if (errItem) throw errItem;

        // Llamar RPC
        const { error: errRpc } = await supabase.rpc('fn_reservar_stock_transferencia', { 
          p_bodega_stock_id: item.bodega_stock_id, 
          p_cantidad: item.cantidad 
        });
        if (errRpc) throw errRpc;
      }

      await fetchTransferencias();
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const recibirTransferencia = async (transferencia_id: string) => {
    try {
      const { error } = await supabase.rpc('fn_completar_transferencia', { 
        p_transferencia_id: transferencia_id 
      });
      if (error) throw error;
      
      await fetchTransferencias();
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  return {
    transferencias,
    sucursales,
    loading,
    fetchTransferencias,
    fetchSucursales,
    fetchDetalle,
    getStockDisponible,
    crearTransferencia,
    recibirTransferencia
  };
};
import { useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import type { Database } from '../../../types/database.types';

type Usuario = Database['public']['Tables']['usuarios']['Row'] & {
  rol?: { nombre: string } | null;
  sucursal?: { nombre: string } | null;
};

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select(`
          *,
          rol:roles!rol_id(nombre),
          sucursal:sucursales!sucursal_id(nombre)
        `)
        .order('nombre', { ascending: true });

      if (error) throw error;
      setUsuarios(data as any);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const invitarUsuario = async (payload: { email: string, nombre: string, rol_id: string, sucursal_id: string }) => {
    try {
      // Llamada a la Edge Function de Supabase
      const { data, error } = await supabase.functions.invoke('invitar_empleado', {
        body: payload
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      await fetchUsuarios();
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  return {
    usuarios,
    loading,
    error,
    fetchUsuarios,
    invitarUsuario
  };
};
import { useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';

export const useClientes = () => {
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('clientes')
      .select('*')
      .order('nombre', { ascending: true });
    
    if (data) setClientes(data);
    setLoading(false);
  }, []);

  const actualizarCliente = async (id: string, nombre: string, telefono: string, email: string) => {
    const { error } = await supabase
      .from('clientes')
      .update({ nombre, telefono, email })
      .eq('id', id);
    
    if (!error) {
      await fetchClientes();
    }
    return { error };
  };

  return {
    clientes,
    loading,
    fetchClientes,
    actualizarCliente
  };
};

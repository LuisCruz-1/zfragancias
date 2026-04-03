import { useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';

export const useVentas = () => {
  const { userProfile } = useAuth();
  const [ventas, setVentas] = useState<any[]>([]);
  const [stockLocal, setStockLocal] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Obtener ventas históricas de la sucursal del vendedor
  const fetchVentas = useCallback(async () => {
    if (!userProfile?.sucursal_id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('ventas')
      .select('*, usuarios!vendedor_id(nombre, apellido), clientes(nombre, telefono)')
      .eq('sucursal_id', userProfile.sucursal_id)
      .order('created_at', { ascending: false });
    
    if (!error && data) setVentas(data);
    setLoading(false);
  }, [userProfile]);

  // Obtener stock disponible SOLO en la sucursal actual para vender
  const fetchStockLocal = useCallback(async () => {
    if (!userProfile?.sucursal_id) return;
    const { data, error } = await supabase
      .from('sucursal_stock')
      .select('*, perfumes(nombre, marca), bodega_stock(precio_publico, costo_unitario_importacion, ganancia_vendedor, comision_vendedor, ganancia_gerente)')
      .eq('sucursal_id', userProfile.sucursal_id)
      .gt('cantidad_disponible', 0);
      
    if (!error && data) setStockLocal(data);
  }, [userProfile]);

  // Procesar una nueva venta
  const registrarVenta = async (clienteId: string | null, total: number, metodoPago: string, items: any[]) => {
    if (!userProfile?.sucursal_id) return { error: 'No tienes sucursal asignada' };

    try {
      // Calcular sumatorias para la cabecera
      let total_costo = 0;
      let total_gv = 0;
      let total_c = 0;
      let total_gg = 0;

      items.forEach(i => {
         total_costo += (i.costo_importacion_unitario * i.cantidad);
         total_gv += (i.ganancia_vendedor_unitario * i.cantidad);
         total_c += (i.comision_unitaria * i.cantidad);
         total_gg += (i.ganancia_gerente_unitaria * i.cantidad);
      });

      // 1. Crear cabecera Venta
      const { data: venta, error: ventaError } = await supabase
        .from('ventas')
        .insert({
          sucursal_id: userProfile.sucursal_id,
          vendedor_id: userProfile.id,
          cliente_id: clienteId,
          total_venta: total,
          total_costo_importacion: total_costo,
          total_ganancia_vendedor: total_gv,
          total_comision: total_c,
          total_ganancia_gerente: total_gg,
          metodo_pago: metodoPago,
          referencia_pago: null,
          estado: 'completada'
        })
        .select()
        .single();

      if (ventaError) throw ventaError;

      // 2. Insertar Detalle Venta
      const detallesItems = items.map(item => ({
        venta_id: venta.id,
        perfume_id: item.perfume_id,
        bodega_stock_id: item.bodega_stock_id,
        cantidad: item.cantidad,
        precio_unitario: item.precio,
        costo_importacion_unitario: item.costo_importacion_unitario,
        ganancia_vendedor_unitario: item.ganancia_vendedor_unitario,
        comision_unitaria: item.comision_unitaria,
        ganancia_gerente_unitaria: item.ganancia_gerente_unitaria,
        subtotal: item.cantidad * item.precio
      }));

      const { error: detalleError } = await supabase
        .from('venta_items')
        .insert(detallesItems);

      if (detalleError) throw detalleError;

      // 3. Actualizar Stock de Sucursal restando las cantidades vendidas
      for (const item of items) {
        const stockRecord = stockLocal.find(s => s.id === item.stock_id);
        if (stockRecord) {
          await supabase
            .from('sucursal_stock')
            .update({ cantidad_disponible: stockRecord.cantidad_disponible - item.cantidad })
            .eq('id', item.stock_id);
        }
      }

      await fetchStockLocal();
      await fetchVentas();

      return { error: null, venta };
    } catch (err: any) {
      console.error(err);
      return { error: err.message };
    }
  };

  return {
    ventas,
    stockLocal,
    loading,
    fetchVentas,
    fetchStockLocal,
    registrarVenta
  };
};
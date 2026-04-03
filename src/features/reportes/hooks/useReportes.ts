import { useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';

export const useReportes = () => {
  const { userProfile } = useAuth();
  const [ventas, setVentas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [metricas, setMetricas] = useState({ totalIngresos: 0, costoTotal: 0, gananciaNeta: 0, comisionesTotales: 0 });
  const [ventasPorVendedor, setVentasPorVendedor] = useState<any[]>([]);

  const fetchReportes = useCallback(async (fechaInicio: string, fechaFin: string, sucursalId?: string) => {
    setLoading(true);
    try {
      // Ajustamos fecha para incluir todo el día de fin
      const finAjustado = `${fechaFin}T23:59:59.999Z`;
      
      let query = supabase
        .from('ventas')
        .select(`
          *,
          usuarios!vendedor_id (id, nombre, apellido),
          venta_items (
            cantidad,
            subtotal,
            precio_unitario,
            costo_importacion_unitario,
            ganancia_vendedor_unitario,
            comision_unitaria,
            ganancia_gerente_unitaria,
            perfumes (nombre)
          )
        `)
        .gte('created_at', fechaInicio)
        .lte('created_at', finAjustado);

      // Filtros por rol
      if (userProfile?.rol?.nombre === 'gerente' || userProfile?.rol?.nombre === 'vendedor') {
        query = query.eq('sucursal_id', userProfile.sucursal_id);
      } else if (sucursalId) {
        query = query.eq('sucursal_id', sucursalId);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      setVentas(data || []);

      // Calcular métricas agregadas
      let ingresos = 0;
      let costos = 0;
      let comisiones = 0;
      let ganancia = 0;
      
      // Agrupar por vendedor para comisiones
      const vendedoresMap: Record<string, any> = {};

      (data || []).forEach(v => {
        ingresos += v.total_venta || 0;
        costos += v.total_costo_importacion || 0;
        comisiones += v.total_comision || 0;
        ganancia += v.total_ganancia_gerente || 0; // O si es admin general, la ganancia real es el restante de lo que queda

        const vendedorId = v.usuarios?.id;
        const nombreVendedor = v.usuarios ? `${v.usuarios.nombre} ${v.usuarios.apellido}` : 'Desconocido';
        
        if (vendedorId) {
          if (!vendedoresMap[vendedorId]) {
            vendedoresMap[vendedorId] = { id: vendedorId, nombre: nombreVendedor, totalVentas: 0, totalMonto: 0, comision: 0 };
          }
          vendedoresMap[vendedorId].totalVentas += 1;
          vendedoresMap[vendedorId].totalMonto += (v.total_venta || 0);
          vendedoresMap[vendedorId].comision += (v.total_comision || 0);
        }
      });

      // Ganancia general (Ingresos - Costos - (Vendedor) - (Comisión) - (Gerente))
      // O si preferimos global:
      let gananciaBruta = ingresos - costos - comisiones;

      setMetricas({
        totalIngresos: ingresos,
        costoTotal: costos,
        gananciaNeta: gananciaBruta,
        comisionesTotales: comisiones
      });
      
      setVentasPorVendedor(Object.values(vendedoresMap).sort((a, b) => b.totalMonto - a.totalMonto));

    } catch (error) {
      console.error('Error fetching reportes:', error);
    } finally {
      setLoading(false);
    }
  }, [userProfile]);

  return {
    ventas,
    ventasPorVendedor,
    metricas,
    loading,
    fetchReportes
  };
};
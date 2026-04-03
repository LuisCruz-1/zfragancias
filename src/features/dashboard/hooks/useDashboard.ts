import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';

export interface DashboardStats {
  gananciaEmpresa?: number;
  valorInventario?: number;
  totalVentas?: number;
  ventasTotalesHoy?: number;
  comisionesEquipo?: number;
  gananciaGerente?: number;
  cantidadVentas?: number;
  misVentasTotales?: number;
  misComisiones?: number;
}

export const useDashboard = () => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    if (!userProfile) return;

    const fetchStats = async () => {
      setLoading(true);
      try {
        const rol = userProfile.rol?.nombre;
        
        // Obtenemos la fecha de hoy para filtrar
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString();

        if (rol === 'admin') {
          // KPIs globales: Ganancia Neta total, valor del inventario global
          const { data: ventasData } = await supabase
            .from('ventas')
            .select('total_ganancia_gerente, total_comision, total_venta')
            .eq('estado', 'completada');

          const { data: stockData } = await supabase
            .from('bodega_stock')
            .select('cantidad_disponible, precio_publico, costo_unitario_importacion');

          // Cálculos básicos
          const gananciaEmpresa = (ventasData || []).reduce((acc, v) => acc + (v.total_venta - (v.total_comision + v.total_ganancia_gerente)), 0);
          const valorInventario = (stockData || []).reduce((acc, s) => acc + (s.cantidad_disponible * s.precio_publico), 0);

          setStats({ gananciaEmpresa, valorInventario, totalVentas: ventasData?.length || 0 });

        } else if (rol === 'gerente' || rol === 'responsable') {
          // Gerente: Ventas de su sucursal de hoy, comisiones generadas por equipo
          if (!userProfile.sucursal_id) return;
          
          const { data: ventasHoy } = await supabase
            .from('ventas')
            .select('total_venta, total_ganancia_gerente, total_comision')
            .eq('sucursal_id', userProfile.sucursal_id)
            .eq('estado', 'completada')
            .gte('created_at', todayStr);

          const ventasTotalesHoy = (ventasHoy || []).reduce((acc, v) => acc + v.total_venta, 0);
          const comisionesEquipo = (ventasHoy || []).reduce((acc, v) => acc + v.total_comision, 0);
          const gananciaGerente = (ventasHoy || []).reduce((acc, v) => acc + v.total_ganancia_gerente, 0);

          setStats({ ventasTotalesHoy, comisionesEquipo, gananciaGerente, cantidadVentas: ventasHoy?.length || 0 });

        } else if (rol === 'vendedor') {
          // Vendedor: Sus ventas del día y su ganancia de comisión
          const { data: misVentasHoy } = await supabase
            .from('ventas')
            .select('total_venta, total_ganancia_vendedor')
            .eq('vendedor_id', userProfile.id)
            .eq('estado', 'completada')
            .gte('created_at', todayStr);

          const misVentasTotales = (misVentasHoy || []).reduce((acc, v) => acc + v.total_venta, 0);
          const misComisiones = (misVentasHoy || []).reduce((acc, v) => acc + v.total_ganancia_vendedor, 0);

          setStats({ misVentasTotales, misComisiones, cantidadVentas: misVentasHoy?.length || 0 });
        }
      } catch (error) {
        console.error("Error al obtener estadísticas del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userProfile]);

  return { stats, loading };
};

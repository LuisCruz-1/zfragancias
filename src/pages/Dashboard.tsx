import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDashboard } from '../features/dashboard/hooks/useDashboard';
import { useReportes } from '../features/reportes/hooks/useReportes';
import { AdminDashboard, GerenteDashboard, VendedorDashboard } from '../features/dashboard/components/DashboardPanels';
import { BarChart3, TrendingUp, DollarSign, Users, Calendar, Download } from 'lucide-react';

const Dashboard = () => {
  const { userProfile } = useAuth();
  const rol = userProfile?.rol?.nombre;
  const isAdmin = rol === 'admin';
  const canViewReports = ['admin', 'gerente', 'responsable'].includes(rol as string);

  const { stats, loading: loadingStats } = useDashboard();
  const { metricas, ventasPorVendedor, loading: loadingReportes, fetchReportes } = useReportes();

  // Rango de fechas por defecto: Mes actual para la sección de reportes
  const hoy = new Date();
  const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().split('T')[0];
  const [fechaInicio, setFechaInicio] = useState(primerDiaMes);
  const [fechaFin, setFechaFin] = useState(hoy.toISOString().split('T')[0]);

  useEffect(() => {
    if (canViewReports) {
      fetchReportes(fechaInicio, fechaFin);
    }
  }, [fetchReportes, fechaInicio, fechaFin, canViewReports]);

  const handleExportCSV = () => {
    const csvContent = [
      ['Vendedor', 'Total Ventas (#)', 'Ingresos Generados ($)', 'Comisión Estimada (5%)'],
      ...ventasPorVendedor.map(v => [v.nombre, v.totalVentas, v.totalMonto.toFixed(2), v.comision.toFixed(2)])
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `comisiones_${fechaInicio}_al_${fechaFin}.csv`;
    link.click();
  };

  return (
    <div className="space-y-8 pb-10">
      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Bienvenido, {userProfile?.nombre}
        </h1>
        <p className="text-slate-500 text-sm">Resumen de actividad y desempeño de tu cuenta.</p>
      </div>

      {/* DASHBOARD GENERAL */}
      <div className="space-y-4">
        {loadingStats ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {rol === 'admin' && <AdminDashboard stats={stats} />}
            {(rol === 'gerente' || rol === 'responsable') && <GerenteDashboard stats={stats} />}
            {rol === 'vendedor' && <VendedorDashboard stats={stats} />}
          </>
        )}
      </div>

      {/* SECCIÓN DE REPORTES (Sólo para gerencia y admin) */}
      {canViewReports && (
        <div className="space-y-6 pt-6 border-t border-slate-200 mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Cierre y Reportes Financieros</h2>
              <p className="text-slate-500 text-sm mt-1">Métricas filtradas de ingresos, costos y comisiones.</p>
            </div>

            <div className="flex gap-2">
              <div className="flex items-center gap-2 bg-white px-3 py-2 border border-slate-200 rounded-lg shadow-sm">
                <Calendar className="w-4 h-4 text-slate-500" />
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={e => setFechaInicio(e.target.value)}
                  className="text-sm outline-none bg-transparent font-medium text-slate-700"
                />
                <span className="text-slate-400">-</span>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={e => setFechaFin(e.target.value)}
                  className="text-sm outline-none bg-transparent font-medium text-slate-700"
                />
              </div>
            </div>
          </div>

          {loadingReportes ? (
            <div className="text-center py-10 text-slate-500">Cargando métricas financieras...</div>
          ) : (
            <>
              {/* Tarjetas de Métricas Filtradas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
                  <div className="p-4 bg-emerald-100 text-emerald-600 rounded-lg">
                    <DollarSign className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Ingresos Totales</p>
                    <p className="text-2xl font-bold text-slate-800">${metricas?.totalIngresos?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>

                {isAdmin && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
                    <div className="p-4 bg-red-100 text-red-600 rounded-lg">
                      <BarChart3 className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Costos (PVP)</p>
                      <p className="text-2xl font-bold text-slate-800">${metricas?.costoTotal?.toFixed(2) || '0.00'}</p>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
                  <div className="p-4 bg-amber-100 text-amber-600 rounded-lg">
                    <Users className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Comisiones (5%)</p>
                    <p className="text-2xl font-bold text-slate-800">${metricas?.comisionesTotales?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>

                {isAdmin && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
                    <div className="p-4 bg-indigo-100 text-indigo-600 rounded-lg">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Ganancia Neta</p>
                      <p className="text-2xl font-bold text-slate-800">${metricas?.gananciaNeta?.toFixed(2) || '0.00'}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tabla Vendedores */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <h2 className="font-bold text-slate-800">Rendimiento por Empleado</h2>
                  <button onClick={handleExportCSV} className="text-indigo-600 text-sm font-medium flex items-center gap-1 hover:text-indigo-800 transition-colors">
                    <Download className="w-4 h-4" /> Exportar CSV
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white text-slate-500 text-sm border-b border-slate-200">
                        <th className="px-6 py-4 font-semibold">Vendedor / Cajero</th>
                        <th className="px-6 py-4 font-semibold">Operaciones (#)</th>
                        <th className="px-6 py-4 font-semibold">Monto Facturado</th>
                        <th className="px-6 py-4 font-semibold text-right">Comisión (5%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(!ventasPorVendedor || ventasPorVendedor.length === 0) ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                            No hay ventas registradas en este período.
                          </td>
                        </tr>
                      ) : (
                        ventasPorVendedor.map((vendedor) => (
                          <tr key={vendedor.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-800">{vendedor.nombre}</td>
                            <td className="px-6 py-4 text-slate-600">{vendedor.totalVentas} ventas</td>
                            <td className="px-6 py-4 text-slate-600 font-bold">${vendedor.totalMonto.toFixed(2)}</td>
                            <td className="px-6 py-4 text-right">
                              <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-bold text-xs border border-amber-200">
                                + ${vendedor.comision.toFixed(2)}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
import type { DashboardStats } from '../hooks/useDashboard';

export const AdminDashboard = ({ stats }: { stats: DashboardStats | null }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Ganancia Neta Total</h3>
        <p className="text-3xl font-bold text-indigo-600">${stats?.gananciaEmpresa?.toFixed(2) || '0.00'}</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Valor de Inventario (PVP)</h3>
        <p className="text-3xl font-bold text-emerald-600">${stats?.valorInventario?.toFixed(2) || '0.00'}</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Ventas Históricas</h3>
        <p className="text-3xl font-bold text-blue-600">{stats?.totalVentas || 0}</p>
      </div>
    </div>
  );
};

export const GerenteDashboard = ({ stats }: { stats: DashboardStats | null }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Ventas de Hoy</h3>
        <p className="text-3xl font-bold text-indigo-600">${stats?.ventasTotalesHoy?.toFixed(2) || '0.00'}</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Cant. Ventas</h3>
        <p className="text-3xl font-bold text-blue-600">{stats?.cantidadVentas || 0}</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Tu Ganancia</h3>
        <p className="text-3xl font-bold text-emerald-600">${stats?.gananciaGerente?.toFixed(2) || '0.00'}</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Comisiones Equipo</h3>
        <p className="text-3xl font-bold text-orange-500">${stats?.comisionesEquipo?.toFixed(2) || '0.00'}</p>
      </div>
    </div>
  );
};

export const VendedorDashboard = ({ stats }: { stats: DashboardStats | null }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Mis Ventas (Hoy)</h3>
        <p className="text-3xl font-bold text-indigo-600">${stats?.misVentasTotales?.toFixed(2) || '0.00'}</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Mis Comisiones (Hoy)</h3>
        <p className="text-3xl font-bold text-emerald-600">${stats?.misComisiones?.toFixed(2) || '0.00'}</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Operaciones del Día</h3>
        <p className="text-3xl font-bold text-blue-600">{stats?.cantidadVentas || 0}</p>
      </div>
    </div>
  );
};
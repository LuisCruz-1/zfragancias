import { useState, useEffect } from 'react';
import { useHistorialVentas } from '../features/ventas/hooks/useHistorialVentas';
import { useAuth } from '../hooks/useAuth';
import { Search, Filter, CalendarDays, Store, AlertTriangle, Eye, Ban, Download } from 'lucide-react';
import { ModalDetalleVenta } from '../features/ventas/components/ModalDetalleVenta';

export const HistorialVentas = () => {
  const { session } = useAuth();
  const esAdmin = session?.user?.user_metadata?.role === 'admin';
  const { ventas, loading, fetchVentas, anularVenta } = useHistorialVentas();

  const [filtros, setFiltros] = useState({
    sucursalId: esAdmin ? '' : session?.user?.user_metadata?.sucursal_id || '',
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: new Date().toISOString().split('T')[0],
    estado: ''
  });

  const [search, setSearch] = useState('');
  const [selectedVenta, setSelectedVenta] = useState<any>(null);
  const [showDetalle, setShowDetalle] = useState(false);
  const [showConfirmAnular, setShowConfirmAnular] = useState<any>(null);

  useEffect(() => {
    fetchVentas(filtros);
  }, [filtros, fetchVentas]);

  const handleAnular = async () => {
    if (!showConfirmAnular) return;
    const success = await anularVenta(showConfirmAnular.id);
    if (success) {
      setShowConfirmAnular(null);
      fetchVentas(filtros);
    }
  };

  const filteredVentas = ventas.filter(v => 
    v.id.toLowerCase().includes(search.toLowerCase()) ||
    v.clientes?.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    v.usuarios?.nombre?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Historial de Ventas</h1>
          <p className="text-slate-500 text-sm mt-1">
            Consulta, filtra y gestiona el registro de ventas
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium">
          <Download className="w-4 h-4" />
          Exportar
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <label className="text-xs font-semibold text-slate-500 mb-1 block">Buscar</label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ref, Cliente, Vendedor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">Fecha Inicio</label>
          <div className="relative">
            <CalendarDays className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="date"
              value={filtros.fechaInicio}
              onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <div>
           <label className="text-xs font-semibold text-slate-500 mb-1 block">Fecha Fin</label>
          <div className="relative">
            <CalendarDays className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="date"
              value={filtros.fechaFin}
              onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">Estado</label>
          <div className="relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={filtros.estado}
              onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none"
            >
              <option value="">Todas</option>
              <option value="completada">Completadas</option>
              <option value="anulada">Anuladas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="px-4 py-3">Referencia / Fecha</th>
                <th className="px-4 py-3">Sucursal / Vendedor</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Total / Pago</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">Cargando ventas...</td>
                </tr>
              ) : filteredVentas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">No se encontraron ventas con estos filtros</td>
                </tr>
              ) : (
                filteredVentas.map((venta) => (
                  <tr key={venta.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{venta.id.split('-')[0].toUpperCase()}</div>
                      <div className="text-xs text-slate-500">{new Date(venta.created_at).toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Store className="w-3.5 h-3.5 text-slate-400" />
                        {venta.sucursales?.nombre}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{venta.usuarios?.nombre}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-700">{venta.clientes?.nombre || 'Consumidor Final'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-800">${venta.total_venta.toFixed(2)}</div>
                      <div className="text-xs text-slate-500 capitalize">{venta.metodo_pago.replace('_', ' ')}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        venta.estado === 'completada' 
                          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20' 
                          : 'bg-red-50 text-red-700 ring-1 ring-red-600/20'
                      }`}>
                        {venta.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedVenta(venta);
                            setShowDetalle(true);
                          }}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {venta.estado === 'completada' && (
                          <button
                            onClick={() => setShowConfirmAnular(venta)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Anular venta"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDetalle && selectedVenta && (
        <ModalDetalleVenta 
          venta={selectedVenta} 
          onClose={() => {
            setShowDetalle(false);
            setSelectedVenta(null);
          }} 
        />
      )}

      {showConfirmAnular && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-center text-slate-800 mb-2">¿Anular Venta?</h3>
            <p className="text-sm text-center text-slate-500 mb-6">
              Esta acción devolverá el stock a la sucursal y marcará la venta como anulada de forma permanente.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmAnular(null)}
                className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAnular}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Sí, Anular
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
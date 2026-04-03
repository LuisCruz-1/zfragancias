import { useEffect, useState } from 'react';
import { useSucursales } from '../features/sucursales/hooks/useSucursales';
import { Building2, Plus, MapPin } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { NuevaSucursalModal } from '../features/sucursales/components/NuevaSucursalModal';

const Sucursales = () => {
  const { sucursales, loading, error, fetchSucursales, crearSucursal } = useSucursales();
  const { userProfile } = useAuth();
  const isAdmin = userProfile?.rol?.nombre === 'admin';
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSucursales();
  }, [fetchSucursales]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Red de Sucursales</h1>
          <p className="text-slate-500">Gestión y control de tiendas físicas y puntos de venta.</p>
        </div>

        {isAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nueva Sucursal
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          Error al cargar sucursales: {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-500">Cargando datos de sucursales...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sucursales.map(sucursal => (
            <div key={sucursal.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="text-indigo-600 w-5 h-5" />
                    <h3 className="font-bold text-slate-800">{sucursal.nombre}</h3>
                  </div>
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md border ${
                    sucursal.activa 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {sucursal.activa ? 'Operativa' : 'Inactiva'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mt-2">
                  <MapPin className="w-3.5 h-3.5" />
                  {sucursal.ciudad}
                </div>
              </div>
              <div className="p-5 flex flex-col gap-3 text-sm">
                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs font-semibold mb-0.5">Dirección / Teléfono</span>
                  <span className="text-slate-800">{sucursal.direccion}</span>
                  {sucursal.telefono && <span className="text-slate-600 font-mono mt-0.5">{sucursal.telefono}</span>}
                </div>
                <div className="flex flex-col mt-2 pt-3 border-t border-slate-100">
                  <span className="text-slate-500 text-xs font-semibold mb-0.5">Encargado / Gerente</span>
                  <span className="text-slate-800 font-medium">
                    {sucursal.responsable ? (sucursal.responsable as any).nombre : 'Sin asignar'}
                  </span>
                  {sucursal.responsable && (
                    <span className="text-slate-500 text-xs">{(sucursal.responsable as any).email}</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {sucursales.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
              No hay sucursales registradas.
            </div>
          )}
        </div>
      )}

      {isAdmin && (
        <NuevaSucursalModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={crearSucursal}
        />
      )}
    </div>
  );
};

export default Sucursales;
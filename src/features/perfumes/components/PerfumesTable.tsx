import type { Database } from '../../../types/database.types';
import { useAuth } from '../../../hooks/useAuth';
import { Edit2, Tag, Droplet } from 'lucide-react';

type Perfume = Database['public']['Tables']['perfumes']['Row'];

interface Props {
  perfumes: Perfume[];
  onEdit: (p: Perfume) => void;
  loading: boolean;
}

export const PerfumesTable = ({ perfumes, onEdit, loading }: Props) => {
  const { userProfile } = useAuth();
  const isAdmin = userProfile?.rol?.nombre === 'admin';

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 flex justify-center isolate">
        <div className="flex items-center gap-3 text-slate-500 font-medium">
          <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          Cargando catálogo...
        </div>
      </div>
    );
  }

  if (perfumes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
        <Tag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-900">No hay perfumes registrados</h3>
        <p className="text-slate-500 mt-1">El catálogo está vacío.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Perfume</th>
              <th className="px-6 py-4">Código</th>
              <th className="px-6 py-4">Marca</th>
              <th className="px-6 py-4">Formato</th>
              <th className="px-6 py-4 text-center">Estado</th>
              {isAdmin && <th className="px-6 py-4 text-center">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {perfumes.map((perfume) => (
              <tr key={perfume.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 overflow-hidden">
                      {perfume.imagen_url ? (
                        <img src={perfume.imagen_url} alt={perfume.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <Droplet className="w-5 h-5 text-indigo-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{perfume.nombre}</p>
                      <p className="text-xs text-slate-500 max-w-[200px] truncate" title={perfume.descripcion}>
                        {perfume.descripcion || 'Sin descripción'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                    {perfume.codigo_unico}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-slate-700">
                  {perfume.marca}
                </td>
                <td className="px-6 py-4 text-slate-600 font-medium">
                  {perfume.ml} ml
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    perfume.activo 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {perfume.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onEdit(perfume)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors inline-flex"
                      title="Editar perfume"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

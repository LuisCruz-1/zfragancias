import { ArrowRightLeft, FileSearch } from "lucide-react";
import type { Database } from "../../../types/database.types";

type Transferencia = Database['public']['Tables']['transferencias']['Row'] & {
  destino?: { nombre: string } | null;
  creador?: { nombre: string } | null;
};

interface Props {
  transferencias: Transferencia[];
  loading: boolean;
  onViewDetalle: (t: Transferencia) => void;
}

const statusColors: Record<string, string> = {
  pendiente: 'bg-amber-100 text-amber-800 border-amber-200',
  aprobada: 'bg-blue-100 text-blue-800 border-blue-200',
  en_transito: 'bg-purple-100 text-purple-800 border-purple-200',
  completada: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  rechazada: 'bg-rose-100 text-rose-800 border-rose-200',
};

export const TransferenciasTable = ({ transferencias, loading, onViewDetalle }: Props) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 flex justify-center">
        <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (transferencias.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <ArrowRightLeft className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-900">Sin Transferencias</h3>
        <p className="text-slate-500">No se encontraron movimientos logísticos.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">ID Trans. / Fecha</th>
              <th className="px-6 py-4">Origen ➔ Destino</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Creado Por</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transferencias.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-mono text-xs font-bold text-slate-700">
                      {t.id.substring(0, 8).toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(t.created_at).toLocaleString()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 font-medium text-slate-700">
                    <span className="capitalize">{t.origen_tipo}</span>
                    <ArrowRightLeft className="w-4 h-4 text-slate-400" />
                    <span className="text-indigo-700 font-bold">{t.destino?.nombre || 'Desconocido'}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold border uppercase tracking-wider ${statusColors[t.estado] || 'bg-gray-100 text-gray-800'}`}>
                    {t.estado.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600 font-medium">
                  {t.creador?.nombre || 'Sistema'}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onViewDetalle(t)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg inline-flex"
                    title="Ver Detalles"
                  >
                    <FileSearch className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
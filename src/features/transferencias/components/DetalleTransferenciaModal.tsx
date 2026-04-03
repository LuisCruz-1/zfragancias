import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { PackageOpen, CheckCircle2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  transferencia: any;
  fetchDetalle: (id: string) => Promise<any[]>;
  onRecibir: (id: string) => Promise<{ error: string | null }>;
}

export const DetalleTransferenciaModal = ({ isOpen, onClose, transferencia, fetchDetalle, onRecibir }: Props) => {
  const { userProfile } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    if (isOpen && transferencia) {
      setLoading(true);
      fetchDetalle(transferencia.id).then((data) => {
        setItems(data);
        setLoading(false);
      });
    }
  }, [isOpen, transferencia, fetchDetalle]);

  if (!isOpen || !transferencia) return null;

  // Solo Gerentes o Responsables de la sucursal de destino y Admin pueden recibir
  const belongsToDestiny = userProfile?.sucursal_id === transferencia.destino_id;
  const canReceive = (belongsToDestiny || userProfile?.rol?.nombre === 'admin') && transferencia.estado === 'en_transito';

  const handleRecibir = async () => {
    setProcesando(true);
    await onRecibir(transferencia.id);
    setProcesando(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Detalle de Transferencia</h2>
            <p className="text-xs text-slate-500 font-mono">ID: {transferencia.id}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold">Destino</p>
              <p className="font-semibold text-indigo-700">{transferencia.destino?.nombre}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold">Estado Actual</p>
              <p className="font-bold text-slate-800 uppercase text-sm mt-0.5">{transferencia.estado.replace('_', ' ')}</p>
            </div>
            {transferencia.notas && (
              <div className="col-span-2">
                <p className="text-xs text-slate-500 uppercase font-bold">Notas</p>
                <p className="text-sm text-slate-700 bg-white p-2 border rounded mt-1">{transferencia.notas}</p>
              </div>
            )}
          </div>

          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <PackageOpen className="w-5 h-5 text-indigo-500" />
            Ítems Enviados
          </h3>

          {loading ? (
            <div className="text-center py-4 text-slate-500">Cargando ítems...</div>
          ) : (
            <ul className="space-y-2">
              {items.map(item => (
                <li key={item.id} className="flex justify-between items-center bg-white border border-slate-200 p-3 rounded-lg shadow-sm">
                  <div>
                    <p className="font-bold text-slate-900">{item.perfume?.nombre} - {item.perfume?.marca}</p>
                    <p className="text-xs font-mono text-slate-500">Lote: {item.bodega_stock?.codigo_lote}</p>
                  </div>
                  <div className="bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-md text-center">
                    <span className="block text-[10px] uppercase font-bold text-indigo-400">Cant.</span>
                    <span className="font-bold text-indigo-700">{item.cantidad_enviada}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50">
            Cerrar
          </button>
          
          {canReceive && (
            <button
              onClick={handleRecibir}
              disabled={procesando}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700 flex items-center gap-2"
            >
              {procesando ? 'Procesando...' : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Recibir Mercadería
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
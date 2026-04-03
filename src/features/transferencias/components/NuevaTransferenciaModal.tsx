import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sucursales: any[];
  getStockDisponible: () => Promise<any[]>;
  onCrear: (destino_id: string, notas: string, items: any[]) => Promise<{ error: string | null }>;
}

export const NuevaTransferenciaModal = ({ isOpen, onClose, sucursales, getStockDisponible, onCrear }: Props) => {
  const [bodegaStock, setBodegaStock] = useState<any[]>([]);
  const [destinoId, setDestinoId] = useState("");
  const [notas, setNotas] = useState("");
  const [carrito, setCarrito] = useState<any[]>([]);
  const [itemSeleccionado, setItemSeleccionado] = useState("");
  const [cantidadInput, setCantidadInput] = useState<number>(1);
  const [procesando, setProcesando] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      getStockDisponible().then(setBodegaStock);
      setDestinoId("");
      setNotas("");
      setCarrito([]);
      setErrorMsg(null);
    }
  }, [isOpen, getStockDisponible]);

  if (!isOpen) return null;

  const lotesDisponibles = bodegaStock.filter(b => b.cantidad_disponible > 0 && !carrito.find(c => c.bodega_stock_id === b.id));
  const loteActual = bodegaStock.find(b => b.id === itemSeleccionado);

  const agregarAlCarrito = () => {
    if (!loteActual) return;
    if (cantidadInput > loteActual.cantidad_disponible || cantidadInput <= 0) {
      setErrorMsg("Cantidad inválida supera el disponible.");
      return;
    }
    
    setCarrito(prev => [...prev, {
      bodega_stock_id: loteActual.id,
      perfume_id: loteActual.perfume_id,
      nombre: loteActual.perfumes?.nombre,
      marca: loteActual.perfumes?.marca,
      lote: loteActual.codigo_lote,
      cantidad: cantidadInput
    }]);
    
    setItemSeleccionado("");
    setCantidadInput(1);
    setErrorMsg(null);
  };

  const eliminarDelCarrito = (bodega_stock_id: string) => {
    setCarrito(prev => prev.filter(c => c.bodega_stock_id !== bodega_stock_id));
  };

  const handleGuardar = async () => {
    if (!destinoId) {
      setErrorMsg("Debe seleccionar una sucursal destino.");
      return;
    }
    if (carrito.length === 0) {
      setErrorMsg("Debe agregar al menos un ítem a la transferencia.");
      return;
    }

    setProcesando(true);
    const { error } = await onCrear(destinoId, notas, carrito);
    setProcesando(false);
    
    if (error) setErrorMsg(error);
    else onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b flex justify-between bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">Nueva Transferencia Logística</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Sucursal Destino <span className="text-red-500">*</span></label>
              <select
                value={destinoId} onChange={e => setDestinoId(e.target.value)}
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Seleccionar Destino --</option>
                {sucursales.map(s => <option key={s.id} value={s.id}>{s.nombre} - {s.ciudad}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Notas de Envío</label>
              <input
                type="text" value={notas} onChange={e => setNotas(e.target.value)} placeholder="Ej. Envío urgente"
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Agregar Mercadería (Bodega Central)</h3>
            <div className="flex gap-2 items-end bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Seleccionar Perfume (Lote)</label>
                <select
                  value={itemSeleccionado} onChange={e => setItemSeleccionado(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="">Buscar en stock disponible...</option>
                  {lotesDisponibles.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.perfumes?.nombre} - Lote: {b.codigo_lote} (Disp: {b.cantidad_disponible})
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-32">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Cantidad a Enviar</label>
                <input
                  type="number" min="1" max={loteActual?.cantidad_disponible || 1}
                  value={cantidadInput} onChange={e => setCantidadInput(Number(e.target.value))}
                  disabled={!itemSeleccionado}
                  className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
              <button
                type="button"
                onClick={agregarAlCarrito}
                disabled={!itemSeleccionado}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2 text-sm font-bold h-[38px]"
              >
                <Plus className="w-4 h-4" /> Agregar
              </button>
            </div>
          </div>

          {carrito.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-2">Carrito de Transferencia</h4>
              <ul className="space-y-2">
                {carrito.map(c => (
                  <li key={c.bodega_stock_id} className="flex justify-between items-center bg-white border border-slate-200 p-3 rounded-lg shadow-sm">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{c.nombre} <span className="text-xs text-slate-500 font-normal">({c.marca})</span></span>
                      <span className="font-mono text-xs text-indigo-600">Lote: {c.lote}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="bg-slate-100 text-slate-800 font-bold px-3 py-1 rounded border border-slate-200">
                        {c.cantidad} uds.
                      </span>
                      <button 
                        onClick={() => eliminarDelCarrito(c.bodega_stock_id)}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3 shrink-0">
          <button onClick={onClose} disabled={procesando} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50">
            Cancelar
          </button>
          <button onClick={handleGuardar} disabled={procesando || carrito.length === 0} className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 flex items-center">
            {procesando ? 'Despachando...' : 'Generar Envío'}
          </button>
        </div>
      </div>
    </div>
  );
};
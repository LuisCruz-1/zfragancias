import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { X, CheckCircle, CreditCard, Banknote, Landmark, Navigation, User, Plus } from 'lucide-react';
import { ModalNuevoCliente } from '../../clientes/components/ModalNuevoCliente';

interface ModalCobroProps {
  total: number;
  onClose: () => void;
  onConfirmar: (metodo: string, montosMixtos?: {efectivo: number, tarjeta: number}, clienteId?: string | null) => Promise<void>;
  isLoading: boolean;
}

export const ModalCobro = ({ total, onClose, onConfirmar, isLoading }: ModalCobroProps) => {
  const [metodo, setMetodo] = useState('efectivo');
  const [montoEfectivo, setMontoEfectivo] = useState(0);
  const [montoTarjeta, setMontoTarjeta] = useState(total);
  const [clientes, setClientes] = useState<any[]>([]);
  const [clienteId, setClienteId] = useState<string | null>(null);
  const [mostrarCrearCliente, setMostrarCrearCliente] = useState(false);

  const fetchClientes = async () => {
    const { data } = await supabase.from('clientes').select('id, nombre').order('nombre');
    if (data) setClientes(data);
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleMixtoChange = (tipo: 'efectivo' | 'tarjeta', valor: number) => {
    let newVal = isNaN(valor) ? 0 : valor;
    if (newVal > total) newVal = total;

    if (tipo === 'efectivo') {
      setMontoEfectivo(newVal);
      setMontoTarjeta(total - newVal);
    } else {
      setMontoTarjeta(newVal);
      setMontoEfectivo(total - newVal);
    }
  };

  const procesar = () => {
    if (metodo === 'mixto') {
      onConfirmar(metodo, { efectivo: montoEfectivo, tarjeta: montoTarjeta }, clienteId);
    } else {
      onConfirmar(metodo, undefined, clienteId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="bg-slate-800 p-4 flex justify-between items-center">
          <h2 className="text-white font-bold text-lg">Procesar Pago</h2>
          <button onClick={onClose} className="text-slate-300 hover:text-white" disabled={isLoading}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl flex justify-between items-center border border-emerald-200">
            <span className="font-medium">Total a Cobrar</span>
            <span className="text-3xl font-black">${total.toFixed(2)}</span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-700">Cliente (Opcional)</label>
              <button 
                onClick={() => setMostrarCrearCliente(true)}
                className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 flex items-center gap-1 px-2 py-1 rounded-md transition-colors"
              >
                <Plus className="w-3 h-3" />
                Nuevo Cliente
              </button>
            </div>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
              <select
                value={clienteId || ''}
                onChange={e => setClienteId(e.target.value || null)}
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none bg-white"
              >
                <option value="">Consumidor Final</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Método de Pago</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'efectivo', label: 'Efectivo', icon: Banknote },
                { id: 'tarjeta_credito', label: 'Tarjeta', icon: CreditCard },
                { id: 'transferencia', label: 'Transferencia', icon: Landmark },
                { id: 'mixto', label: 'Pago Mixto', icon: Navigation }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setMetodo(opt.id)}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                    metodo === opt.id 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <opt.icon className={`w-5 h-5 ${metodo === opt.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span className="text-sm font-semibold">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {metodo === 'mixto' && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider text-center">Dividir Pago</p>
              
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Monto Efectivo</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                  <input 
                    type="number" 
                    value={montoEfectivo || ''}
                    onChange={e => handleMixtoChange('efectivo', parseFloat(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-600 mb-1 block">Monto Tarjeta / Transferencia</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                  <input 
                    type="number" 
                    value={montoTarjeta || ''}
                    onChange={e => handleMixtoChange('tarjeta', parseFloat(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={procesar}
            disabled={isLoading}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isLoading ? 'Cobrando...' : (
              <>
                <CheckCircle className="w-4 h-4" />
                Completar Venta
              </>
            )}
          </button>
        </div>
      </div>

      {mostrarCrearCliente && (
        <ModalNuevoCliente 
          onClose={() => setMostrarCrearCliente(false)}
          onCrear={async (nuevoId) => {
            await fetchClientes();
            setClienteId(nuevoId);
            setMostrarCrearCliente(false);
          }}
        />
      )}
    </div>
  );
};

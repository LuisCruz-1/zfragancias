import { useState, useEffect } from 'react';
import type { Database } from '../../../types/database.types';
import type { InsertBodegaStock } from '../hooks/useBodega';
import { useAuth } from '../../../hooks/useAuth';

type Perfume = Database['public']['Tables']['perfumes']['Row'];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  perfumes: Perfume[];
  onSave: (lote: InsertBodegaStock) => Promise<{ error: string | null }>;
}

export const IngresoMercaderiaModal = ({ isOpen, onClose, perfumes, onSave }: Props) => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    perfume_id: '',
    codigo_lote: '',
    fecha_llegada: new Date().toISOString().split('T')[0],
    cantidad_inicial: 0,
    costo_unitario_importacion: 0,
    precio_publico: 0,
    ganancia_vendedor: 0,
    comision_vendedor: 0,
    ganancia_gerente: 0,
    notas: ''
  });

  // Reset al abrir
  useEffect(() => {
    if (isOpen) {
      setFormData({
        perfume_id: perfumes.length > 0 ? perfumes[0].id : '',
        codigo_lote: `LOTE-${new Date().getTime().toString().slice(-6)}`,
        fecha_llegada: new Date().toISOString().split('T')[0],
        cantidad_inicial: 0,
        costo_unitario_importacion: 0,
        precio_publico: 0,
        ganancia_vendedor: 0,
        comision_vendedor: 0,
        ganancia_gerente: 0,
        notas: ''
      });
      setErrorMsg(null);
    }
  }, [isOpen, perfumes]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile?.id) return;
    
    setErrorMsg(null);
    setLoading(true);

    const payload: InsertBodegaStock = {
      ...formData,
      cantidad_disponible: formData.cantidad_inicial, // Al ingresar, lo disponible es igual a lo inicial
      cantidad_reservada: 0, // Inicia sin reservas
      creado_por: userProfile.id
    };

    const { error } = await onSave(payload);
    
    setLoading(false);
    if (error) {
      setErrorMsg(error);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
          <h2 className="text-lg font-bold text-gray-800">
            Ingreso de Mercadería (Nuevo Lote)
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-semibold leading-none">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
              {errorMsg}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Perfume (Catálogo)</label>
              <select
                required
                name="perfume_id"
                value={formData.perfume_id}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="" disabled>Selecciona un perfume...</option>
                {perfumes.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre} - {p.marca} ({p.codigo_unico})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Código de Lote</label>
              <input
                required type="text" name="codigo_lote" value={formData.codigo_lote} onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Fecha Llegada</label>
              <input
                required type="date" name="fecha_llegada" value={formData.fecha_llegada} onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Cantidad Recibida</label>
              <input
                required type="number" min="1" name="cantidad_inicial" value={formData.cantidad_inicial || ''} onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-indigo-600 bg-indigo-50"
              />
            </div>
            
            <div className="hidden md:block"></div> {/* Espaciador */}

            <h3 className="col-span-2 text-sm font-bold text-slate-800 uppercase tracking-widest border-b pb-1 mt-2">Configuración Financiera ($)</h3>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Costo Unit. Importación</label>
              <input
                required type="number" min="0" step="0.01" name="costo_unitario_importacion" value={formData.costo_unitario_importacion || ''} onChange={handleChange}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-rose-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Precio Al Público (PVP)</label>
              <input
                required type="number" min="0" step="0.01" name="precio_publico" value={formData.precio_publico || ''} onChange={handleChange}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-indigo-600 font-bold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Comisión Vendedor</label>
              <input
                required type="number" min="0" step="0.01" name="comision_vendedor" value={formData.comision_vendedor || ''} onChange={handleChange}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-emerald-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Ganancia Vendedor (Fija)</label>
              <input
                required type="number" min="0" step="0.01" name="ganancia_vendedor" value={formData.ganancia_vendedor || ''} onChange={handleChange}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-emerald-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Ganancia Gerente</label>
              <input
                required type="number" min="0" step="0.01" name="ganancia_gerente" value={formData.ganancia_gerente || ''} onChange={handleChange}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-blue-600 font-medium"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-600 mb-1">Notas (Opcional)</label>
              <textarea
                name="notas" value={formData.notas} onChange={handleChange} rows={2}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3 border-t pt-4 border-gray-100 shrink-0">
            <button
              type="button" onClick={onClose} disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
            >
              Cancelar
            </button>
            <button
              type="submit" disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none disabled:opacity-50 min-w-[120px] flex justify-center items-center"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Confirmar Ingreso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
import { useState, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<{ error: string | null }>;
}

export const NuevaSucursalModal = ({ isOpen, onClose, onSave }: Props) => {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    ciudad: '',
    telefono: '',
    activa: true
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({ nombre: '', direccion: '', ciudad: '', telefono: '', activa: true });
      setErrorMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await onSave(formData);
    setLoading(false);

    if (error) {
      setErrorMsg(error);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
          <h2 className="text-lg font-bold text-gray-800">Registrar Nueva Sucursal</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Comercial <span className="text-red-500">*</span></label>
            <input required type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Ej. Zapphiro Centro" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Ciudad <span className="text-red-500">*</span></label>
            <input required type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Ej. Quito" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Dirección <span className="text-red-500">*</span></label>
            <input required type="text" name="direccion" value={formData.direccion} onChange={handleChange} className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Ej. Av. Amazonas y Roca" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Teléfono</label>
            <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Ej. 0987654321" />
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" id="activa" name="activa" checked={formData.activa} onChange={handleChange} className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
            <label htmlFor="activa" className="text-sm font-medium text-gray-700 cursor-pointer">Sucursal Activa y Operativa</label>
          </div>

          <div className="mt-4 flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50">Cancelar</button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">{loading ? 'Guardando...' : 'Crear Sucursal'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
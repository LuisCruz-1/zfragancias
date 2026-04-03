import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<{ error: string | null }>;
}

export const InvitarUsuarioModal = ({ isOpen, onClose, onSave }: Props) => {
  const [formData, setFormData] = useState({ nombre: '', email: '', rol_id: '', sucursal_id: '' });
  const [roles, setRoles] = useState<any[]>([]);
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({ nombre: '', email: '', rol_id: '', sucursal_id: '' });
      setErrorMsg(null);
      supabase.from('roles').select('*').then(({ data }) => setRoles(data || []));
      supabase.from('sucursales').select('*').eq('activa', true).then(({ data }) => setSucursales(data || []));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const rolSeleccionado = roles.find(r => r.id === formData.rol_id);
  const isBodega = rolSeleccionado && (rolSeleccionado.nombre === 'admin' || rolSeleccionado.nombre === 'bodega');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    
    // Si es admin o bodega central, puede quedar sucursal nula
    const payload = {
      ...formData,
      sucursal_id: isBodega ? "" : formData.sucursal_id
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
          <h2 className="text-lg font-bold text-gray-800">Invitar / Crear Empleado</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
              {errorMsg}
            </div>
          )}

          <div className="bg-amber-50 text-amber-800 p-3 rounded-md text-xs border border-amber-200 flex gap-2 items-start leading-relaxed">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p>Se enviará un correo de bienvenida a esta dirección para que el empleado asigne su propia contraseña.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Completo <span className="text-red-500">*</span></label>
            <input required type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Ej. Juan Pérez" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Correo Electrónico <span className="text-red-500">*</span></label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="ejemplo@zapphiro.com" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Rol de Acceso <span className="text-red-500">*</span></label>
            <select required name="rol_id" value={formData.rol_id} onChange={handleChange} className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="" disabled>Selecciona un rol...</option>
              {roles.map(r => (
                <option key={r.id} value={r.id}>{r.nombre.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {formData.rol_id && !isBodega && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Asignar a Sucursal <span className="text-red-500">*</span></label>
              <select required name="sucursal_id" value={formData.sucursal_id} onChange={handleChange} className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="" disabled>Selecciona una sucursal...</option>
                {sucursales.map(s => (
                  <option key={s.id} value={s.id}>{s.nombre} - {s.ciudad}</option>
                ))}
              </select>
            </div>
          )}

          <div className="mt-4 flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50">Cancelar</button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 flex items-center">
              {loading ? 'Invitando...' : 'Enviar Invitación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
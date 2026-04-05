import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { X, CheckCircle, UserPlus, Phone, Mail } from 'lucide-react';

interface ModalNuevoClienteProps {
  onClose: () => void;
  onCrear: (nuevoClienteId: string) => void;
  clienteEditar?: any | null;
}

export const ModalNuevoCliente = ({ onClose, onCrear, clienteEditar }: ModalNuevoClienteProps) => {
  const [nombre, setNombre] = useState(clienteEditar?.nombre || '');
  const [telefono, setTelefono] = useState(clienteEditar?.telefono || '');
  const [email, setEmail] = useState(clienteEditar?.email || '');
  const [isLoading, setIsLoading] = useState(false);

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre) return alert('El nombre es obligatorio');
    
    setIsLoading(true);
    
    if (clienteEditar) {
      const { error } = await supabase
        .from('clientes')
        .update({ nombre, telefono, email })
        .eq('id', clienteEditar.id);
        
      setIsLoading(false);
      if (error) {
        alert('Error editando cliente: ' + error.message);
      } else {
        alert('Cliente editado exitosamente');
        onCrear(clienteEditar.id);
      }
    } else {
      const { data, error } = await supabase
        .from('clientes')
        .insert({ nombre, telefono, email })
        .select('id')
        .single();

      setIsLoading(false);
      
      if (error) {
        alert('Error creando cliente: ' + error.message);
      } else if (data) {
        alert('Cliente creado exitosamente');
        onCrear(data.id); 
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2 font-bold">
            <UserPlus className="w-5 h-5" />
            <h3>{clienteEditar ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
          </div>
          <button onClick={onClose} className="text-indigo-200 hover:text-white transition-colors" disabled={isLoading}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={guardar} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo *</label>
            <div className="relative">
              <UserPlus className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input 
                type="text" 
                autoFocus
                required
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Ej. Juan Pérez"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono (Opcional)</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input 
                type="text" 
                value={telefono}
                onChange={e => setTelefono(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Ej. 0991234567"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico (Opcional)</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
            <button 
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 transition-all"
            >
              {isLoading ? 'Guardando...' : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Guardar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
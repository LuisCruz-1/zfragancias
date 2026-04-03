import { useEffect, useState } from 'react';
import { useUsuarios } from '../features/usuarios/hooks/useUsuarios';
import { Users, UserPlus, FileText } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { InvitarUsuarioModal } from '../features/usuarios/components/InvitarUsuarioModal';

const Usuarios = () => {
  const { usuarios, loading, error, fetchUsuarios, invitarUsuario } = useUsuarios();
  const { userProfile } = useAuth();
  const isAdmin = userProfile?.rol?.nombre === 'admin';
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Recursos Humanos</h1>
          <p className="text-slate-500">Administración de usuarios, roles y asignación de sucursales.</p>
        </div>

        {isAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-all flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Invitar Empleado
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          Error al cargar usuarios: {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-500">Cargando personal...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Usuario</th>
                  <th className="px-6 py-4">Rol / Permisos</th>
                  <th className="px-6 py-4">Asignación</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                  {isAdmin && <th className="px-6 py-4 text-center">Acciones</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usuarios.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                          {user.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{user.nombre}</span>
                          <span className="text-xs text-slate-500">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        (user.rol as any)?.nombre === 'admin' ? 'bg-purple-100 text-purple-700' :
                        (user.rol as any)?.nombre === 'gerente' ? 'bg-amber-100 text-amber-700' :
                        (user.rol as any)?.nombre === 'responsable' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {(user.rol as any)?.nombre || 'Sin Rol'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {(user.sucursal as any)?.nombre || (
                        <span className="text-slate-400 italic">Bodega Central o Global</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${
                        user.activo 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                        : 'bg-rose-50 border-rose-200 text-rose-700'
                      }`}>
                        {user.activo ? 'Activo' : 'Suspendido'}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-center">
                        <button className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors inline-flex" title="Ver Perfil">
                          <FileText className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {usuarios.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>No hay personal registrado.</p>
            </div>
          )}
        </div>
      )}

      {isAdmin && (
        <InvitarUsuarioModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={invitarUsuario}
        />
      )}
    </div>
  );
};

export default Usuarios;
import { useState, useEffect } from 'react';
import { useClientes } from '../features/clientes/hooks/useClientes';
import { ModalNuevoCliente } from '../features/clientes/components/ModalNuevoCliente';
import { Users, Search, Plus, Edit2 } from 'lucide-react';

const Clientes = () => {
  const { clientes, loading, fetchClientes } = useClientes();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [clienteEditar, setClienteEditar] = useState<any | null>(null);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const abrirNuevo = () => {
    setClienteEditar(null);
    setModalAbierto(true);
  };

  const abrirEditar = (cliente: any) => {
    setClienteEditar(cliente);
    setModalAbierto(true);
  };

  const clientesFiltrados = clientes.filter(c => 
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    (c.telefono && c.telefono.includes(busqueda)) ||
    (c.email && c.email.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            Directorio de Clientes
          </h1>
          <p className="text-slate-500">Gestión de la base de datos de compradores</p>
        </div>
        
        <button 
          onClick={abrirNuevo}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Registrar Cliente
        </button>
      </div>

      {/* Buscador */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400" />
        <input 
          type="text"
          placeholder="Buscar por nombre, teléfono o correo..."
          className="flex-1 outline-none text-slate-700"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* Tabla */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="px-6 py-4 font-semibold">Nombre del Cliente</th>
                <th className="px-6 py-4 font-semibold">Teléfono de Contacto</th>
                <th className="px-6 py-4 font-semibold">Correo Electrónico</th>
                <th className="px-6 py-4 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={4} className="text-center py-8 text-slate-500">Cargando clientes...</td></tr>
              ) : clientesFiltrados.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-slate-500">No se encontraron clientes.</td></tr>
              ) : (
                clientesFiltrados.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {cliente.nombre}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {cliente.telefono || <span className="text-slate-400 italic">No registrado</span>}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {cliente.email || <span className="text-slate-400 italic">No registrado</span>}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => abrirEditar(cliente)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      {modalAbierto && (
        <ModalNuevoCliente 
          onClose={() => setModalAbierto(false)}
          clienteEditar={clienteEditar}
          onCrear={async () => {
            setModalAbierto(false);
            await fetchClientes();
          }}
        />
      )}
    </div>
  );
};

export default Clientes;
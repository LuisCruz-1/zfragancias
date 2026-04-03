import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTransferencias } from '../features/transferencias/hooks/useTransferencias';
import { TransferenciasTable } from '../features/transferencias/components/TransferenciasTable';
import { DetalleTransferenciaModal } from '../features/transferencias/components/DetalleTransferenciaModal';
import { NuevaTransferenciaModal } from '../features/transferencias/components/NuevaTransferenciaModal';
import { Truck } from 'lucide-react';

const Transferencias = () => {
  const { userProfile } = useAuth();
  const isAdmin = userProfile?.rol?.nombre === 'admin';
  const isGerente = userProfile?.rol?.nombre === 'gerente';

  const { transferencias, sucursales, loading, fetchTransferencias, fetchSucursales, fetchDetalle, getStockDisponible, crearTransferencia, recibirTransferencia } = useTransferencias();
  
  const [modalDetalleTransferencia, setModalDetalleTransferencia] = useState<any>(null);
  const [modalNuevaAbierta, setModalNuevaAbierta] = useState(false);

  useEffect(() => {
    fetchTransferencias();
    if (isAdmin || isGerente) {
      fetchSucursales();
    }
  }, [fetchTransferencias, fetchSucursales, isAdmin, isGerente]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Logística y Transferencias</h1>
          <p className="text-slate-500">
            {isAdmin ? 'Gestión de envíos desde Bodega a Sucursales.' : 'Recepción de mercadería de Bodega Central.'}
          </p>
        </div>

        {isAdmin && (
          <button 
            onClick={() => setModalNuevaAbierta(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm shadow-indigo-200 transition-all flex items-center gap-2"
          >
            <Truck className="w-5 h-5" />
            Despachar a Sucursal
          </button>
        )}
      </div>

      <TransferenciasTable 
        transferencias={transferencias} 
        loading={loading} 
        onViewDetalle={(t) => setModalDetalleTransferencia(t)} 
      />

      <DetalleTransferenciaModal 
        isOpen={!!modalDetalleTransferencia}
        onClose={() => setModalDetalleTransferencia(null)}
        transferencia={modalDetalleTransferencia}
        fetchDetalle={fetchDetalle}
        onRecibir={recibirTransferencia}
      />

      {isAdmin && (
        <NuevaTransferenciaModal
          isOpen={modalNuevaAbierta}
          onClose={() => setModalNuevaAbierta(false)}
          sucursales={sucursales}
          getStockDisponible={getStockDisponible}
          onCrear={crearTransferencia}
        />
      )}
    </div>
  );
};

export default Transferencias;
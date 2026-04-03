import { useEffect, useState } from 'react';
import { useBodega } from '../features/bodega/hooks/useBodega';
import { BodegaStockTable } from '../features/bodega/components/BodegaStockTable';
import { IngresoMercaderiaModal } from '../features/bodega/components/IngresoMercaderiaModal';
import { Plus } from 'lucide-react';

const Bodega = () => {
  const { stock, perfumes, loading, fetchStock, fetchActivePerfumes, ingresarMercaderia } = useBodega();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchStock();
    fetchActivePerfumes();
  }, [fetchStock, fetchActivePerfumes]);

  const handleSave = async (payload: any) => {
    return await ingresarMercaderia(payload);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Bodega Central</h1>
          <p className="text-slate-500">Gestión de lotes e importaciones maestras.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm shadow-indigo-200 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Ingresar Mercadería
        </button>
      </div>

      <BodegaStockTable stock={stock} loading={loading} />

      <IngresoMercaderiaModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        perfumes={perfumes}
        onSave={handleSave}
      />
    </div>
  );
};

export default Bodega;
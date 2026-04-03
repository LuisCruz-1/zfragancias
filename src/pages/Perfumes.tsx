import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePerfumes } from '../features/perfumes/hooks/usePerfumes';
import { PerfumesTable } from '../features/perfumes/components/PerfumesTable';
import { PerfumeModal } from '../features/perfumes/components/PerfumeModal';
import { Plus } from 'lucide-react';
import type { Database } from '../types/database.types';

type Perfume = Database['public']['Tables']['perfumes']['Row'];
type InsertPerfume = Omit<Perfume, 'id' | 'created_at'>;

const Perfumes = () => {
  const { userProfile } = useAuth();
  const isAdmin = userProfile?.rol?.nombre === 'admin';
  
  const { perfumes, loading, fetchPerfumes, createPerfume, updatePerfume } = usePerfumes();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [perfumeToEdit, setPerfumeToEdit] = useState<Perfume | null>(null);

  useEffect(() => {
    fetchPerfumes();
  }, [fetchPerfumes]);

  const handleOpenNew = () => {
    setPerfumeToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (perfume: Perfume) => {
    setPerfumeToEdit(perfume);
    setIsModalOpen(true);
  };

  const handleSave = async (perfumeData: InsertPerfume, id?: string) => {
    if (id) {
      return await updatePerfume(id, perfumeData);
    } else {
      return await createPerfume(perfumeData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Catálogo de Perfumes</h1>
          <p className="text-slate-500">Gestión de productos y referencias base.</p>
        </div>
        
        {isAdmin && (
          <button 
            onClick={handleOpenNew}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm shadow-indigo-200 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nuevo Perfume
          </button>
        )}
      </div>

      <PerfumesTable 
        perfumes={perfumes} 
        onEdit={handleOpenEdit} 
        loading={loading} 
      />

      {isAdmin && (
        <PerfumeModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          perfumeToEdit={perfumeToEdit}
        />
      )}
    </div>
  );
};

export default Perfumes;
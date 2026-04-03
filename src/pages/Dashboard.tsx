import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDashboard } from '../features/dashboard/hooks/useDashboard';
import { AdminDashboard, GerenteDashboard, VendedorDashboard } from '../features/dashboard/components/DashboardPanels';

const Dashboard = () => {
  const { userProfile } = useAuth();
  const { stats, loading } = useDashboard();
  const rol = userProfile?.rol?.nombre;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Bienvenido, {userProfile?.nombre}
        </h1>
        <p className="text-slate-500">Resumen de actividad y desempeño.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {rol === 'admin' && <AdminDashboard stats={stats} />}
          {(rol === 'gerente' || rol === 'responsable') && <GerenteDashboard stats={stats} />}
          {rol === 'vendedor' && <VendedorDashboard stats={stats} />}
        </>
      )}
    </div>
  );
};

export default Dashboard;
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layout global
import { MainLayout } from '../components/layout/MainLayout';
import { RoleGuard } from '../components/layout/RoleGuard';

// Páginas
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Bodega from '../pages/Bodega';
import Transferencias from '../pages/Transferencias';
import Sucursales from '../pages/Sucursales';
import Ventas from '../pages/Ventas';
import Clientes from '../pages/Clientes';
import { HistorialVentas } from '../pages/HistorialVentas';
import Perfumes from '../pages/Perfumes';
import Usuarios from '../pages/Usuarios';
import Ayuda from '../pages/Ayuda';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: (
          <RoleGuard allowedRoles={['admin', 'gerente', 'responsable', 'vendedor']}>
            <Dashboard />
          </RoleGuard>
        )
      },
      {
        path: 'bodega',
        element: (
          <RoleGuard allowedRoles={['admin']}>
            <Bodega />
          </RoleGuard>
        )
      },
      {
        path: 'transferencias',
        element: (
          <RoleGuard allowedRoles={['admin', 'gerente', 'responsable']}>
            <Transferencias />
          </RoleGuard>
        )
      },
      {
        path: 'sucursales',
        element: (
          <RoleGuard allowedRoles={['admin']}>
            <Sucursales />
          </RoleGuard>
        )
      },
      {
        path: 'ventas',
        element: (
          <RoleGuard allowedRoles={['admin', 'gerente', 'responsable', 'vendedor']}>
            <Ventas />
          </RoleGuard>
        )
      },
      {
        path: 'historial-ventas',
        element: (
          <RoleGuard allowedRoles={['admin', 'gerente', 'responsable', 'vendedor']}>
            <HistorialVentas />
          </RoleGuard>
        )
      },
      {
        path: 'clientes',
        element: (
          <RoleGuard allowedRoles={['admin', 'gerente', 'responsable', 'vendedor']}>
            <Clientes />
          </RoleGuard>
        )
      },
      {
        path: 'perfumes',
        element: (
          <RoleGuard allowedRoles={['admin', 'gerente', 'responsable', 'vendedor']}>
            <Perfumes />
          </RoleGuard>
        )
      },
      {
        path: 'usuarios',
        element: (
          <RoleGuard allowedRoles={['admin']}>
            <Usuarios />
          </RoleGuard>
        )
      },
      {
        path: 'ayuda',
        element: (
          <RoleGuard allowedRoles={['admin', 'gerente', 'responsable', 'vendedor']}>
            <Ayuda />
          </RoleGuard>
        )
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);
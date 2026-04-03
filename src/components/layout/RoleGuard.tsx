import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export type Rol = "admin" | "gerente" | "responsable" | "vendedor";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Rol[];
}

export const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  const { userProfile, loading } = useAuth();
  const userRole = userProfile?.rol?.nombre as Rol;

  if (loading) return null;
  
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { Rol } from "../../types/database.types";

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

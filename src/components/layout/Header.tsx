import { 
  Building2, 
  Store, 
  ShoppingBag, 
  Warehouse, 
  ArrowRightLeft, 
  Users, 
  PieChart,
  LayoutDashboard,
  LogOut
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export const Header = () => {
  const { userProfile, signOut } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Zapphiro ERP
        </h2>
        {userProfile?.sucursal_id && (
          <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium border border-indigo-100 flex items-center gap-2">
            <Store className="w-4 h-4" />
            Sucursal {userProfile.sucursal_id.substring(0, 4).toUpperCase()}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-gray-900">{userProfile?.nombre}</p>
          <p className="text-xs text-gray-500 capitalize">{userProfile?.rol?.nombre}</p>
        </div>
        
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
          {userProfile?.nombre?.charAt(0).toUpperCase() || 'U'}
        </div>

        <div className="w-px h-6 bg-gray-200 mx-2"></div>

        <button 
          onClick={signOut}
          className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-red-50 flex items-center justify-center"
          title="Cerrar Sesión"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

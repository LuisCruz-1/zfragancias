import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { 
  LayoutDashboard, 
  Warehouse, 
  ShoppingBag, 
  ArrowRightLeft, 
  Store, 
  PieChart, 
  Users, 
  Droplet,
  X
} from "lucide-react";

type Rol = "admin" | "gerente" | "responsable" | "vendedor";

interface MenuItem {
  path: string;
  label: string;
  icon: React.ElementType;
  roles: Rol[];
}

const MENU_ITEMS: MenuItem[] = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "gerente", "responsable", "vendedor"] },
  { path: "/ventas", label: "Punto de Venta", icon: ShoppingBag, roles: ["admin", "gerente", "responsable", "vendedor"] },
  { path: "/perfumes", label: "Catálogo", icon: Droplet, roles: ["admin", "gerente", "responsable", "vendedor"] },
  { path: "/transferencias", label: "Transferencias", icon: ArrowRightLeft, roles: ["admin", "gerente", "responsable"] },
  { path: "/reportes", label: "Reportes", icon: PieChart, roles: ["admin", "gerente", "responsable"] },
  { path: "/bodega", label: "Bodega Central", icon: Warehouse, roles: ["admin"] },
  { path: "/sucursales", label: "Sucursales", icon: Store, roles: ["admin"] },
  { path: "/usuarios", label: "Usuarios", icon: Users, roles: ["admin"] },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { userProfile } = useAuth();
  const userRole = userProfile?.rol?.nombre as Rol;

  const accessibleItems = MENU_ITEMS.filter((item) => 
    userRole ? item.roles.includes(userRole) : false
  );

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col shrink-0 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 shrink-0">
          <h1 className="text-xl font-black tracking-widest text-indigo-400">
            ZAPPHIRO
          </h1>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Módulos
          </p>
          {accessibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  // Close sidebar on mobile when navigating
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/20 font-medium"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 font-medium"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800 rounded-xl p-4 flex flex-col gap-1">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Rol de acceso</span>
            <span className="text-sm font-semibold capitalize text-indigo-300">
              {userRole || 'Sin Rol'}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

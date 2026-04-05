const fs = require('fs');

let content = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');

const newCode = `interface MenuItemGroup {
  group: string;
  items: MenuItem[];
}

const MENU_GROUPS: MenuItemGroup[] = [
  {
    group: 'Principal',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'gerente', 'responsable', 'vendedor'] }
    ]
  },
  {
    group: 'Comercial',
    items: [
      { path: '/ventas', label: 'Punto de Venta', icon: ShoppingBag, roles: ['admin', 'gerente', 'responsable', 'vendedor'] },
      { path: '/historial-ventas', label: 'Historial de Ventas', icon: History, roles: ['admin', 'gerente', 'responsable', 'vendedor'] },
      { path: '/clientes', label: 'Clientes', icon: Users, roles: ['admin', 'gerente', 'responsable', 'vendedor'] }
    ]
  },
  {
    group: 'Inventario',
    items: [
      { path: '/perfumes', label: 'Catálogo', icon: Droplet, roles: ['admin', 'gerente', 'responsable', 'vendedor'] },
      { path: '/transferencias', label: 'Transferencias', icon: ArrowRightLeft, roles: ['admin', 'gerente', 'responsable'] },
      { path: '/bodega', label: 'Bodega Central', icon: Warehouse, roles: ['admin'] }
    ]
  },
  {
    group: 'Administración',
    items: [
      { path: '/reportes', label: 'Reportes', icon: PieChart, roles: ['admin', 'gerente', 'responsable'] },
      { path: '/sucursales', label: 'Sucursales', icon: Store, roles: ['admin'] },  
      { path: '/usuarios', label: 'Usuarios', icon: Users, roles: ['admin'] }
    ]
  }
];`;

content = content.replace(/const MENU_ITEMS[\s\S]*?\];/, newCode);

const newComponentCode = `export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { userProfile } = useAuth();
  const userRole = userProfile?.rol?.nombre as Rol;

  const accessibleGroups = MENU_GROUPS.map(group => ({
    ...group,
    items: group.items.filter(item => userRole ? item.roles.includes(userRole) : false)
  })).filter(group => group.items.length > 0);`;

content = content.replace(/export const Sidebar =[\s\S]*?false\n  \);/, newComponentCode);

const newNavCode = `        <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-6">  
          {accessibleGroups.map((group, index) => (
            <div key={index} className="flex flex-col gap-1">
              <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {group.group}
              </p>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={({ isActive }) =>
                      \`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 \${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20 font-medium'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 font-medium'
                      }\`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>`;

content = content.replace(/<nav className="flex-1 overflow-y-auto[\s\S]*?<\/nav>/, newNavCode);

fs.writeFileSync('src/components/layout/Sidebar.tsx', content);
console.log('Sidebar updated');

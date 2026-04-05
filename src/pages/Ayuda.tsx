import { useState } from 'react';
import { 
  BookOpen, 
  Map, 
  ShoppingBag, 
  Warehouse, 
  Settings, 
  ChevronRight, 
  ShieldCheck, 
  ArrowRightLeft
} from 'lucide-react';

type TabId = 'inicio' | 'ventas' | 'inventario' | 'roles';

export default function Ayuda() {
  const [activeTab, setActiveTab] = useState<TabId>('inicio');

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Centro de Ayuda y Documentación</h1>
        <p className="text-slate-500 mt-2">Aprende a configurar, operar y entender el ERP Zapphiro desde cero.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Menú de Navegación de Ayuda */}
        <aside className="md:w-64 shrink-0">
          <nav className="flex flex-col space-y-1">
            <TabLink 
              id="inicio" current={activeTab} set={setActiveTab} 
              icon={<Map className="w-5 h-5" />} label="🚀 Guía de Inicio (Zero to Hero)" 
            />
            <TabLink 
              id="ventas" current={activeTab} set={setActiveTab} 
              icon={<ShoppingBag className="w-5 h-5" />} label="🛒 Punto de Venta (POS)" 
            />
            <TabLink 
              id="inventario" current={activeTab} set={setActiveTab} 
              icon={<Warehouse className="w-5 h-5" />} label="📦 Bodega y Transferencias" 
            />
            <TabLink 
              id="roles" current={activeTab} set={setActiveTab} 
              icon={<ShieldCheck className="w-5 h-5" />} label="🔐 Permisos y Seguridad" 
            />
          </nav>
        </aside>

        {/* Contenido Principal */}
        <main className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          {activeTab === 'inicio' && <TabInicio />}
          {activeTab === 'ventas' && <TabVentas />}
          {activeTab === 'inventario' && <TabInventario />}
          {activeTab === 'roles' && <TabRoles />}
        </main>
      </div>
    </div>
  );
}

// ------------------- TABS COMPONENTS -------------------

function TabInicio() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Map className="text-indigo-600 w-6 h-6" />
          Configuración Principal (Desde Cero)
        </h2>
        <p className="text-slate-500 mt-1">El orden exacto para iniciar a operar el ERP si es tu primer día.</p>
      </div>

      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
        
        <StepCard number={1} title="Crea tus Sucursales" icon={<Settings className="w-5 h-5" />}>
          Antes de vender o enviar mercancía, el sistema debe saber <strong className="text-indigo-600">dónde</strong> operarás. 
          Dirigite al módulo de <strong>Configuración {'>'} Sucursales</strong> (solo Admins) y registra cada tienda física especificando nombre y dirección. La "Bodega Central" cuenta como un ente separado, no necesitas crearla aquí.
        </StepCard>

        <StepCard number={2} title="Registra tus Tipos de Perfumes (Catálogo)" icon={<BookOpen className="w-5 h-5" />}>
          Ve al módulo <strong>Catálogo</strong> y registra los perfumes de forma teórica. Aquí llenas Título (ej. <em>Aqua Di Gio</em>), Marca, etc. <br/><br/>
          <span className="text-amber-600 font-medium">Ojo:</span> Registrar el catálogo NO te da inventario mágico. Solo define "lo que la tienda vende" para que luego puedas ingresarlo a bodega.
        </StepCard>

        <StepCard number={3} title="Ingresa Mercadería Real a Bodega" icon={<Warehouse className="w-5 h-5" />}>
          Ahora que el sistema sabe qué vendes (perfumes), vamos al módulo <strong>Bodega Central</strong>. 
          Aquí usas "Nuevo Ingreso" para registrar la mercadería física que acaba de llegar a la empresa (lote, cantidad, costo unitario, precio de venta, margen del vendedor). Esto llenará tus estantes maestro.
        </StepCard>

        <StepCard number={4} title="Asigna Personal (Usuarios)" icon={<ShieldCheck className="w-5 h-5" />}>
          Un sistema no se maneja solo. Ve al módulo <strong>Usuarios</strong>. Invita a tu personal ingresando sus emails, asígnales un <strong>Rol</strong> (Gerente, Vendedor, etc.) y muy importante, <strong>asígnales una Sucursal</strong> donde trabajarán.
        </StepCard>

        <StepCard number={5} title="Transfiere de Bodega a Sucursales" icon={<ArrowRightLeft className="w-5 h-5" />}>
          Los vendedores en sucursal no pueden vender si tienen 0 stock. Usa el módulo <strong>Transferencias</strong>. Selecciona "Nueva Transferencia", origen "Bodega", destino "Tu Sucursal" y envía X cantidades de cada perfume. Una vez la transferencia sea marcada como <em>Completada</em>, el stock caerá en manos de la sucursal.
        </StepCard>

        <StepCard number={6} title="¡Comienza a cobrar ventas!" icon={<ShoppingBag className="w-5 h-5" />}>
          El vendedor asignado a su sucursal entra al <strong>Punto de Venta</strong>. Verá exclusivamente el inventario que le fue transferido en el paso 5. Añade al carrito, imprime ticket, y se genera la ganancia neta y comisión final visible en su Dashboard.
        </StepCard>

      </div>
    </div>
  );
}

function TabVentas() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <ShoppingBag className="text-emerald-600 w-6 h-6" />
          Módulo de Ventas (Punto de Venta)
        </h2>
        <p className="text-slate-500 mt-1">El corazón del sistema. Cómo cobrar de manera segura y flexible.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-2">1. ¿Qué aparece en el POS?</h3>
          <p className="text-sm text-slate-600">
            A diferencia de la Bodega, a un Vendedor <strong>solo le aparecerán en pantalla</strong> los productos que: 
            <br/>a) Tienen stock {'>'} 0 en su sucursal asiganada.
            <br/>b) Han ingresado legalmente mediante una <em>Transferencia</em> aceptada.
          </p>
        </div>

        <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100">
          <h3 className="font-bold text-emerald-900 mb-2">2. Pagos Mixtos</h3>
          <p className="text-sm text-emerald-700">
            Si un cliente compra $100 pero quiere pagar $40 en Efectivo y $60 en Tarjeta, selecciona "Mixto" en el Modal de Cobro. El sistema dividirá los pagos internamente en la contabilidad y se reflejará detalladamente en el Historial de Ventas.
          </p>
        </div>

        <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
          <h3 className="font-bold text-indigo-900 mb-2">3. Creación Rápida de Cliente</h3>
          <p className="text-sm text-indigo-700">
            Puedes hacer una factura a "Consumidor Final" dejándolo vacío en el modal de cobro. Si requieres datos, puedes usar el botón "+" en la caja de clientes del mismo modal para crearlo "al vuelo" sin perder la factura que tienes armada.
          </p>
        </div>

        <div className="bg-red-50 p-5 rounded-xl border border-red-100">
          <h3 className="font-bold text-red-900 mb-2">4. Anular una Venta</h3>
          <p className="text-sm text-red-700">
            Los errores ocurren. Si cruzaste una venta mal, puedes ir a <strong>Historial de Ventas</strong> (si tienes acceso), presionar el ícono rojo de "Anular". 
            Esto registrará la venta como tachada con valor $0 en el cierre y <strong>devolverá tu stock inmediatamente</strong> a tu tienda para que lo vuelvas a vender.
          </p>
        </div>
      </div>
    </div>
  );
}

function TabInventario() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Warehouse className="text-blue-600 w-6 h-6" />
          Bodega Central y Transferencias
        </h2>
        <p className="text-slate-500 mt-1">Manejo seguro de la ubicación de los perfumes.</p>
      </div>

      <div className="prose prose-slate max-w-none text-sm space-y-4">
        <p>
          El ERP Zapphiro garantiza que el dinero no se pierda en el aire usando un sistema de <strong>Movimientos y Restricciones Estrictas de Bases de Datos</strong> (Técnicamente PL/PgSQL):
        </p>

        <h4>¿Por qué las transferencias tienen "Estados"?</h4>
        <ul className="list-disc pl-5">
          <li><strong>Pendiente:</strong> La transferencia acaba de ser solicitada (quizá un vendedor pidió stock al admin, o viceversa).</li>
          <li><strong>En Tránsito:</strong> El administrador aprobó y la mercancía está físicamente en un camión/viaje. El stock "Reservado" en este punto pertenece al limbo.</li>
          <li><strong>Completada:</strong> La sucursal recibió presencialmente el material (o tú se lo forzaste como completado). Aquí ocurre el descuento ofical de la bodega principal hacia los pasillos de ventas.</li>
        </ul>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg my-6">
          <h4 className="text-blue-900 font-bold m-0 mb-1">¡Nunca pierdes ingresos!</h4>
          <p className="text-blue-800 m-0">Cuando un administrador ingresa stock en Bodega, especifica el "Costo" y el "PVP" (Precio Público). Cuando ese perfume viaja a cualquier sucursal arrastra esa etiqueta de precio históricamente para que el sistema de Reportes sepa cuánto ganaste neto con cada mililitro vendido en el país.</p>
        </div>
      </div>
    </div>
  );
}

function TabRoles() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <ShieldCheck className="text-orange-600 w-6 h-6" />
          Permisos y Privacidad
        </h2>
        <p className="text-slate-500 mt-1">Acá puedes ver lo que cada empleado tiene derecho a usar.</p>
      </div>

      <div className="space-y-4">
        <RoleCard 
          role="Admin (Dueño)" 
          color="orange"
          desc="El súper usuario. Es el único que puede ver el costo de importación, ver la bodega central general, nombrar gerentes, crear otros admins, anular ventas de quien sea a cualquier hora, y examinar el Dashboard con las ganancias totales de la empresa entera."
        />
        <RoleCard 
          role="Gerente / Responsable" 
          color="indigo"
          desc="Tienen permiso extendido. Pueden entrar la página de transferencias para aceptar inventarios hacia sus sucursales, así como ver reportes limitados sobre los vendedores a su cargo para pagar comisiones sin ver información súper confidencial (como el costo capital inicial)."
        />
        <RoleCard 
          role="Vendedor" 
          color="emerald"
          desc="El empleado en mostrador. Solo ve el Punto de Venta, Catálogo visual, Clientes y su Dashboard. Su Panel solo muestra las comisiones individuales de sus ventas y la meta diaria. El sistema impide que altere el stock directamente a no ser mediante un comprobante del POS."
        />
      </div>
    </div>
  );
}


// --- UTILIDADES MENORES ---

function TabLink({ id, current, set, icon, label }: { id: TabId, current: TabId, set: any, icon: React.ReactNode, label: string }) {
  const active = current === id;
  return (
    <button
      onClick={() => set(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all ${
        active 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      {icon}
      {label}
      {active && <ChevronRight className="w-4 h-4 ml-auto" />}
    </button>
  );
}

function StepCard({ number, title, icon, children }: { number: number, title: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="relative flex items-start gap-4 md:gap-6 z-10 p-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black shadow-md border-4 border-white shadow-indigo-900/30">
        {number}
      </div>
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group hover:border-indigo-300 transition-colors">
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex items-center gap-2">
          <span className="text-slate-400">{icon}</span>
          <h3 className="font-bold text-slate-800">{title}</h3>
        </div>
        <div className="p-5 text-sm text-slate-600 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

function RoleCard({ role, desc, color }: { role: string, desc: string, color: string }) {
  const colors: Record<string, string> = {
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  };
  return (
    <div className={`p-5 rounded-xl border ${colors[color]}`}>
      <h3 className="font-bold mb-1 text-lg">{role}</h3>
      <p className="text-sm opacity-90 leading-relaxed">{desc}</p>
    </div>
  );
}
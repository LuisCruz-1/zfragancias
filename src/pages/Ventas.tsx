import { useState, useEffect } from 'react';
import { useVentas } from '../features/ventas/hooks/useVentas';
import { ShoppingCart, PackageSearch, Trash2, Plus, Minus } from 'lucide-react';

const Ventas = () => {
  const { stockLocal, registrarVenta, fetchStockLocal } = useVentas();
  
  const [carrito, setCarrito] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState('');
  
  useEffect(() => {
    fetchStockLocal();
  }, [fetchStockLocal]);

  const agregarAlCarrito = (item: any) => {
    const existe = carrito.find(c => c.stock_id === item.id);
    if (existe) {
      if (existe.cantidad >= item.cantidad_disponible) return; // No supera stock
      setCarrito(carrito.map(c => c.stock_id === item.id ? { ...c, cantidad: c.cantidad + 1 } : c));
    } else {
      setCarrito([...carrito, { 
        stock_id: item.id, 
        perfume_id: item.perfume_id,
        bodega_stock_id: item.bodega_stock_id,
        perfume: item.perfumes?.nombre, 
        precio: item.bodega_stock?.precio_publico || 0,
        costo_importacion_unitario: item.bodega_stock?.costo_unitario_importacion || 0,
        ganancia_vendedor_unitario: item.bodega_stock?.ganancia_vendedor || 0,
        comision_unitaria: item.bodega_stock?.comision_vendedor || 0,
        ganancia_gerente_unitaria: item.bodega_stock?.ganancia_gerente || 0,
        cantidad: 1, 
        max: item.cantidad_disponible 
      }]);
    }
  };

  const modificarCantidad = (stock_id: string, suma: number) => {
    setCarrito(carrito.map(c => {
      if (c.stock_id === stock_id) {
        const nueva = c.cantidad + suma;
        if (nueva > 0 && nueva <= c.max) return { ...c, cantidad: nueva };
      }
      return c;
    }));
  };

  const eliminarDelCarrito = (stock_id: string) => {
    setCarrito(carrito.filter(c => c.stock_id !== stock_id));
  };

  const total = carrito.reduce((acc, current) => acc + (current.precio * current.cantidad), 0);

  const cobrar = async () => {
    if (carrito.length === 0) return;
    const { error } = await registrarVenta(null, total, 'efectivo', carrito);
    if (!error) {
      setCarrito([]);
      alert("Venta procesada exitosamente.");
    } else {
      alert("Error procesando venta: " + error);
    }
  };

  const stockFiltrado = stockLocal.filter(s => s.perfumes?.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Catálogo de Venta */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
          <PackageSearch className="text-slate-500" />
          <input 
            type="text" 
            placeholder="Buscar perfume en stock de tu sucursal..." 
            className="flex-1 bg-white border outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-4 py-2"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-4">
          {stockFiltrado.map(item => (
            <div 
              key={item.id} 
              onClick={() => agregarAlCarrito(item)}
              className="border border-slate-200 rounded-xl p-4 cursor-pointer hover:border-indigo-500 hover:shadow-md transition-all group"
            >
              <div className="text-sm font-bold text-slate-800 line-clamp-2">{item.perfumes?.nombre}</div>
              <div className="text-xs text-slate-500 mb-2">{item.perfumes?.marca}</div>
              <div className="flex justify-between items-end mt-4">
                <span className="text-lg font-black text-indigo-700">${item.bodega_stock?.precio_publico || 0}</span>
                <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">Stock: {item.cantidad_disponible}</span>
              </div>
            </div>
          ))}
          {stockFiltrado.length === 0 && (
            <div className="col-span-full h-full flex flex-col items-center justify-center text-slate-500">
              <PackageSearch className="w-12 h-12 mb-2 text-slate-300" />
              <p>No se encontraron productos en stock</p>
            </div>
          )}
        </div>
      </div>

      {/* POS Ticket */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-indigo-50 flex gap-2 items-center">
          <ShoppingCart className="text-indigo-600" />
          <h2 className="font-bold text-indigo-900">Ticket de Venta</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {carrito.length === 0 ? (
              <div className="text-center text-slate-500 text-sm mt-10">Agregue productos para comenzar</div>
            ) : (
              carrito.map(c => (
                <div key={c.stock_id} className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div className="flex-1">
                    <div className="font-bold text-slate-800 text-sm">{c.perfume}</div>
                    <div className="text-slate-500 text-xs">${c.precio} un.</div>
                    
                    <div className="flex items-center gap-3 mt-2">
                      <button onClick={() => modificarCantidad(c.stock_id, -1)} className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200 transition-colors">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-sm w-4 text-center">{c.cantidad}</span>
                      <button onClick={() => modificarCantidad(c.stock_id, 1)} className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200 transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col flex-1 items-end justify-between self-stretch">
                    <span className="font-black text-slate-800">${(c.precio * c.cantidad).toFixed(2)}</span>
                    <button onClick={() => eliminarDelCarrito(c.stock_id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-600 font-bold">Total a Cobrar:</span>
            <span className="text-2xl font-black text-emerald-600">${total.toFixed(2)}</span>
          </div>
          
          <button 
            onClick={cobrar}
            disabled={carrito.length === 0}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            PROCESAR VENTA
          </button>
        </div>
      </div>
    </div>
  );
};

export default Ventas;
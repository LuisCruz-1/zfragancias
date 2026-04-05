import { useState, useEffect } from 'react';
import { X, Package, CreditCard, Banknote, Navigation, Landmark } from 'lucide-react';
import { useHistorialVentas } from '../hooks/useHistorialVentas';

interface ModalDetalleVentaProps {
  venta: any;
  onClose: () => void;
}

export const ModalDetalleVenta = ({ venta, onClose }: ModalDetalleVentaProps) => {
  const { fetchDetalleVenta } = useHistorialVentas();
  const [items, setItems] = useState<any[]>([]);
  const [pagos, setPagos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      const res = await fetchDetalleVenta(venta.id);
      if (res.items) setItems(res.items);
      if (res.pagos) setPagos(res.pagos);
      setLoading(false);
    };
    loadDetails();
  }, [venta.id, fetchDetalleVenta]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
          <div>
            <h3 className="font-bold flex items-center gap-2">
              <Package className="w-5 h-5" />
              Detalle de Venta
            </h3>
            <p className="text-xs text-indigo-200 mt-1">Ref: {venta.id.split('-')[0].toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="text-indigo-200 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="py-10 text-center text-slate-500">Cargando detalles...</div>
          ) : (
            <div className="space-y-6">
              
              {/* Información General */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Fecha</p>
                  <p className="text-sm font-bold text-slate-800">
                    {new Date(venta.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Cliente</p>
                  <p className="text-sm font-bold text-slate-800">{venta.clientes?.nombre || 'Consumidor Final'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Vendedor</p>
                  <p className="text-sm font-bold text-slate-800">{venta.usuarios?.nombre}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Estado</p>
                  <p className="text-sm font-bold mt-1">
                    {venta.estado === 'completada' 
                      ? <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs">Completada</span>
                      : <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs">Anulada</span>
                    }
                  </p>
                </div>
              </div>

              {/* Items Vendidos */}
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-3 border-b pb-2">Productos ({items.length})</h4>
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{item.perfumes?.nombre}</p>
                        <p className="text-xs text-slate-500">{item.perfumes?.marca}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-800">${item.precio_unitario.toFixed(2)}</p>
                        <p className="text-xs text-slate-500">x{item.cantidad} un.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desglose de Pago */}
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h4 className="text-sm font-bold text-indigo-900 mb-1">Método de Pago</h4>
                  <div className="flex items-center gap-2 text-indigo-700 text-sm font-medium capitalize">
                    {venta.metodo_pago === 'efectivo' && <Banknote className="w-4 h-4" />}
                    {venta.metodo_pago.includes('tarjeta') && <CreditCard className="w-4 h-4" />}
                    {venta.metodo_pago === 'transferencia' && <Landmark className="w-4 h-4" />}
                    {venta.metodo_pago === 'mixto' && <Navigation className="w-4 h-4" />}
                    {venta.metodo_pago.replace('_', ' ')}
                  </div>
                  
                  {venta.metodo_pago === 'mixto' && pagos.length > 0 && (
                    <div className="mt-2 space-y-1 pl-6">
                      {pagos.map(p => (
                        <div key={p.id} className="flex gap-2 text-xs text-indigo-600">
                          <span className="w-16 capitalize">{p.metodo_pago.replace('_', ' ')}:</span>
                          <span className="font-bold">${p.monto.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="text-right w-full sm:w-auto">
                  <p className="text-xs text-indigo-600 font-medium uppercase tracking-wider">Total Cobrado</p>
                  <p className="text-3xl font-black text-indigo-700">${venta.total_venta.toFixed(2)}</p>
                </div>
              </div>

            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
import { Box, Package, Target } from "lucide-react";
import type { BodegaStockWithPerfume } from "../hooks/useBodega";

interface Props {
  stock: BodegaStockWithPerfume[];
  loading: boolean;
}

export const BodegaStockTable = ({ stock, loading }: Props) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 flex justify-center isolate">
        <div className="flex items-center gap-3 text-slate-500 font-medium">
          <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          Cargando inventario de bodega...
        </div>
      </div>
    );
  }

  if (stock.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
        <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-900">Bodega Vacía</h3>
        <p className="text-slate-500 mt-1">No hay lotes registrados actualmente.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Lote / Fecha</th>
              <th className="px-6 py-4">Perfume</th>
              <th className="px-6 py-4 text-center">Stock (Disp/Rsv/Ini)</th>
              <th className="px-6 py-4 text-right">Costos (Import. / PVP)</th>
              <th className="px-6 py-4 text-right">Ganancias (Vend/Ger)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {stock.map((lote) => (
              <tr key={lote.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-mono text-xs font-bold text-slate-700">{lote.codigo_lote}</span>
                    <span className="text-xs text-slate-500">{new Date(lote.fecha_llegada).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">{lote.perfume?.nombre || 'Desconocido'}</span>
                    <span className="text-xs text-slate-500">{lote.perfume?.marca} • {lote.perfume?.codigo_unico}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded border border-emerald-200" title="Disponible">
                      {lote.cantidad_disponible}
                    </span>
                    <span className="bg-amber-100 text-amber-800 font-bold px-2 py-1 rounded border border-amber-200 text-xs" title="Reservada">
                      {lote.cantidad_reservada}
                    </span>
                    <span className="text-slate-400 text-xs font-medium" title="Inicial">
                      / {lote.cantidad_inicial}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex flex-col">
                    <span className="text-rose-600 font-medium text-xs">Costo: ${lote.costo_unitario_importacion.toFixed(2)}</span>
                    <span className="text-indigo-600 font-bold">PVP: ${lote.precio_publico.toFixed(2)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex flex-col">
                    <span className="text-emerald-600 font-medium text-xs">Vendedor: ${lote.ganancia_vendedor.toFixed(2)} (+${lote.comision_vendedor.toFixed(2)})</span>
                    <span className="text-blue-600 font-medium text-xs">Gerente: ${lote.ganancia_gerente.toFixed(2)}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

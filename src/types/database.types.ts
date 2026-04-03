export type Rol = 'admin' | 'gerente' | 'responsable' | 'vendedor';
export type TransferenciaEstado = 'pendiente' | 'aprobada' | 'en_transito' | 'completada' | 'rechazada';
export type OrigenTipo = 'bodega' | 'sucursal';
export type MetodoPago = 'efectivo' | 'transferencia' | 'tarjeta_credito' | 'tarjeta_debito' | 'mixto';
export type MetodoPagoIndividual = 'efectivo' | 'transferencia' | 'tarjeta_credito' | 'tarjeta_debito';
export type EstadoVenta = 'completada' | 'anulada';

export interface Database {
  public: {
    Tables: {
      roles: {
        Row: {
          id: number;
          nombre: Rol;
        };
      };
      usuarios: {
        Row: {
          id: string;
          auth_user_id: string;
          nombre: string;
          email: string;
          rol_id: number;
          sucursal_id: string | null;
          activo: boolean;
          created_at: string;
        };
      };
      sucursales: {
        Row: {
          id: string;
          nombre: string;
          direccion: string;
          ciudad: string;
          telefono: string;
          responsable_id: string;
          activa: boolean;
          created_at: string;
        };
      };
      perfumes: {
        Row: {
          id: string;
          codigo_unico: string;
          nombre: string;
          marca: string;
          descripcion: string;
          ml: number;
          imagen_url: string;
          activo: boolean;
          created_at: string;
        };
      };
      bodega_stock: {
        Row: {
          id: string;
          perfume_id: string;
          codigo_lote: string;
          fecha_llegada: string;
          cantidad_inicial: number;
          cantidad_disponible: number;
          cantidad_reservada: number;
          costo_unitario_importacion: number;
          precio_publico: number;
          ganancia_vendedor: number;
          comision_vendedor: number;
          ganancia_gerente: number;
          notas: string | null;
          creado_por: string;
          created_at: string;
          updated_at: string;
        };
      };
      transferencias: {
        Row: {
          id: string;
          origen_tipo: OrigenTipo;
          origen_id: string;
          destino_id: string;
          estado: TransferenciaEstado;
          notas: string | null;
          creado_por: string;
          aprobado_por: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      transferencia_items: {
        Row: {
          id: string;
          transferencia_id: string;
          bodega_stock_id: string;
          perfume_id: string;
          cantidad_solicitada: number;
          cantidad_enviada: number;
        };
      };
      sucursal_stock: {
        Row: {
          id: string;
          sucursal_id: string;
          perfume_id: string;
          bodega_stock_id: string;
          cantidad_disponible: number;
          updated_at: string;
        };
      };
      clientes: {
        Row: {
          id: string;
          nombre: string;
          telefono: string;
          email: string;
          created_at: string;
        };
      };
      ventas: {
        Row: {
          id: string;
          sucursal_id: string;
          vendedor_id: string;
          cliente_id: string | null;
          metodo_pago: MetodoPago;
          referencia_pago: string | null;
          total_venta: number;
          total_costo_importacion: number;
          total_ganancia_vendedor: number;
          total_comision: number;
          total_ganancia_gerente: number;
          estado: EstadoVenta;
          notas: string | null;
          created_at: string;
        };
      };
      venta_items: {
        Row: {
          id: string;
          venta_id: string;
          perfume_id: string;
          bodega_stock_id: string;
          cantidad: number;
          precio_unitario: number;
          costo_importacion_unitario: number;
          ganancia_vendedor_unitario: number;
          comision_unitaria: number;
          ganancia_gerente_unitaria: number;
          subtotal: number;
        };
      };
      venta_pagos: {
        Row: {
          id: string;
          venta_id: string;
          metodo_pago: MetodoPagoIndividual;
          monto: number;
          referencia: string | null;
        };
      };
    };
  };
}
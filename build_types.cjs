const fs = require('fs');

const types = `export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      roles: {
        Row: { id: string, nombre: string }
        Insert: { id?: string, nombre: string }
        Update: { id?: string, nombre?: string }
      }
      sucursales: {
        Row: { id: string, nombre: string, direccion: string | null, ciudad: string | null, telefono: string | null, responsable_id: string | null, activa: boolean, created_at: string }
        Insert: { id?: string, nombre: string, direccion?: string | null, ciudad?: string | null, telefono?: string | null, responsable_id?: string | null, activa?: boolean, created_at?: string }
        Update: { id?: string, nombre?: string, direccion?: string | null, ciudad?: string | null, telefono?: string | null, responsable_id?: string | null, activa?: boolean, created_at?: string }
      }
      usuarios: {
        Row: { id: string, auth_user_id: string, nombre: string, email: string, rol_id: string, sucursal_id: string | null, activo: boolean, created_at: string }
        Insert: { id?: string, auth_user_id: string, nombre: string, email: string, rol_id: string, sucursal_id?: string | null, activo?: boolean, created_at?: string }
        Update: { id?: string, auth_user_id?: string, nombre?: string, email?: string, rol_id?: string, sucursal_id?: string | null, activo?: boolean, created_at?: string }
      }
      perfumes: {
        Row: { id: string, codigo_unico: string, nombre: string, marca: string, descripcion: string | null, ml: number | null, imagen_url: string | null, activo: boolean, created_at: string }
        Insert: { id?: string, codigo_unico: string, nombre: string, marca: string, descripcion?: string | null, ml?: number | null, imagen_url?: string | null, activo?: boolean, created_at?: string }
        Update: { id?: string, codigo_unico?: string, nombre?: string, marca?: string, descripcion?: string | null, ml?: number | null, imagen_url?: string | null, activo?: boolean, created_at?: string }
      }
      bodega_stock: {
        Row: { id: string, perfume_id: string, codigo_lote: string, fecha_llegada: string, cantidad_inicial: number, cantidad_disponible: number, cantidad_reservada: number, costo_unitario_importacion: number, precio_publico: number, ganancia_vendedor: number, comision_vendedor: number, ganancia_gerente: number, notas: string | null, creado_por: string | null, created_at: string, updated_at: string }
        Insert: { id?: string, perfume_id: string, codigo_lote: string, fecha_llegada: string, cantidad_inicial: number, cantidad_disponible?: number, cantidad_reservada?: number, costo_unitario_importacion: number, precio_publico: number, ganancia_vendedor?: number, comision_vendedor?: number, ganancia_gerente?: number, notas?: string | null, creado_por?: string | null, created_at?: string, updated_at?: string }
        Update: { id?: string, perfume_id?: string, codigo_lote?: string, fecha_llegada?: string, cantidad_inicial?: number, cantidad_disponible?: number, cantidad_reservada?: number, costo_unitario_importacion?: number, precio_publico?: number, ganancia_vendedor?: number, comision_vendedor?: number, ganancia_gerente?: number, notas?: string | null, creado_por?: string | null, created_at?: string, updated_at?: string }
      }
      transferencias: {
        Row: { id: string, origen_tipo: string, origen_id: string | null, destino_id: string, estado: string, notas: string | null, creado_por: string | null, aprobado_por: string | null, created_at: string, updated_at: string }
        Insert: { id?: string, origen_tipo: string, origen_id?: string | null, destino_id: string, estado?: string, notas?: string | null, creado_por?: string | null, aprobado_por?: string | null, created_at?: string, updated_at?: string }
        Update: { id?: string, origen_tipo?: string, origen_id?: string | null, destino_id?: string, estado?: string, notas?: string | null, creado_por?: string | null, aprobado_por?: string | null, created_at?: string, updated_at?: string }
      }
      transferencia_items: {
        Row: { id: string, transferencia_id: string, bodega_stock_id: string, perfume_id: string, cantidad_solicitada: number, cantidad_enviada: number | null }
        Insert: { id?: string, transferencia_id: string, bodega_stock_id: string, perfume_id: string, cantidad_solicitada: number, cantidad_enviada?: number | null }
        Update: { id?: string, transferencia_id?: string, bodega_stock_id?: string, perfume_id?: string, cantidad_solicitada?: number, cantidad_enviada?: number | null }
      }
      sucursal_stock: {
        Row: { id: string, sucursal_id: string, perfume_id: string, bodega_stock_id: string, cantidad_disponible: number, updated_at: string }
        Insert: { id?: string, sucursal_id: string, perfume_id: string, bodega_stock_id: string, cantidad_disponible?: number, updated_at?: string }
        Update: { id?: string, sucursal_id?: string, perfume_id?: string, bodega_stock_id?: string, cantidad_disponible?: number, updated_at?: string }
      }
      clientes: {
        Row: { id: string, nombre: string, telefono: string | null, email: string | null, created_at: string }
        Insert: { id?: string, nombre: string, telefono?: string | null, email?: string | null, created_at?: string }
        Update: { id?: string, nombre?: string, telefono?: string | null, email?: string | null, created_at?: string }
      }
      ventas: {
        Row: { id: string, sucursal_id: string, vendedor_id: string, cliente_id: string | null, metodo_pago: string, referencia_pago: string | null, total_venta: number, total_costo_importacion: number, total_ganancia_vendedor: number, total_comision: number, total_ganancia_gerente: number, estado: string, notas: string | null, created_at: string }
        Insert: { id?: string, sucursal_id: string, vendedor_id: string, cliente_id?: string | null, metodo_pago: string, referencia_pago?: string | null, total_venta?: number, total_costo_importacion?: number, total_ganancia_vendedor?: number, total_comision?: number, total_ganancia_gerente?: number, estado?: string, notas?: string | null, created_at?: string }
        Update: { id?: string, sucursal_id?: string, vendedor_id?: string, cliente_id?: string | null, metodo_pago?: string, referencia_pago?: string | null, total_venta?: number, total_costo_importacion?: number, total_ganancia_vendedor?: number, total_comision?: number, total_ganancia_gerente?: number, estado?: string, notas?: string | null, created_at?: string }
      }
      venta_items: {
        Row: { id: string, venta_id: string, perfume_id: string, bodega_stock_id: string, cantidad: number, precio_unitario: number, costo_importacion_unitario: number, ganancia_vendedor_unitario: number, comision_unitaria: number, ganancia_gerente_unitaria: number, subtotal: number }
        Insert: { id?: string, venta_id: string, perfume_id: string, bodega_stock_id: string, cantidad: number, precio_unitario: number, costo_importacion_unitario: number, ganancia_vendedor_unitario?: number, comision_unitaria?: number, ganancia_gerente_unitaria?: number, subtotal: number }
        Update: { id?: string, venta_id?: string, perfume_id?: string, bodega_stock_id?: string, cantidad?: number, precio_unitario?: number, costo_importacion_unitario?: number, ganancia_vendedor_unitario?: number, comision_unitaria?: number, ganancia_gerente_unitaria?: number, subtotal?: number }
      }
      venta_pagos: {
        Row: { id: string, venta_id: string, metodo_pago: string, monto: number, referencia: string | null }
        Insert: { id?: string, venta_id: string, metodo_pago: string, monto: number, referencia?: string | null }
        Update: { id?: string, venta_id?: string, metodo_pago?: string, monto?: number, referencia?: string | null }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      fn_completar_transferencia: {
        Args: { p_transferencia_id: string }
        Returns: void
      }
      fn_anular_venta: {
        Args: { p_venta_id: string }
        Returns: void
      }
      fn_reservar_stock_transferencia: {
        Args: { p_bodega_stock_id: string, p_cantidad: number }
        Returns: void
      }
      fn_liberar_reserva_transferencia: {
        Args: { p_transferencia_id: string }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
`;

fs.writeFileSync('src/types/database.types.ts', types, 'utf8');
console.log('Done writing types');

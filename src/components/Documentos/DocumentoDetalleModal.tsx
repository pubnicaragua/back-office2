import React from 'react';
import { Modal } from '../Common/Modal';
import { Calendar, FileText } from 'lucide-react';
import { useSupabaseData } from '../../hooks/useSupabaseData';

interface DocumentoDetalleModalProps {
  isOpen: boolean;
  onClose: () => void;
  documento: any;
}

export function DocumentoDetalleModal({ isOpen, onClose, documento }: DocumentoDetalleModalProps) {
  const { data: ventaItems, loading } = useSupabaseData<any>(
    'venta_items',
    '*, productos(nombre)',
    documento?.id ? { venta_id: documento.id } : null
  );

  if (!documento) return null;

  const productos = ventaItems || [];

  const total = productos.reduce((sum, item) => sum + (parseFloat(item.subtotal) || 0), 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalle del Documento" size="xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de productos */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500">
                <span>Productos</span>
                <span>Cantidad</span>
                <span>Precio Unit.</span>
                <span>Subtotal</span>
              </div>
            </div>
            <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
              {productos.map((item, index) => (
                <div key={index} className="px-6 py-4">
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <span className="text-gray-900">{item.productos?.nombre || 'Producto'}</span>
                    <span className="text-gray-600">{item.cantidad}</span>
                    <span className="text-gray-600">${parseFloat(item.precio_unitario || 0).toLocaleString('es-CL')}</span>
                    <span className="text-gray-900 font-medium">${parseFloat(item.subtotal || 0).toLocaleString('es-CL')}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-lg font-semibold text-gray-900">${total.toLocaleString('es-CL')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Información lateral */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Documento:
                </label>
                <span className="text-sm text-gray-900">{documento.tipo}</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Folio:
                </label>
                <span className="text-sm text-gray-900">{documento.folio}</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha:
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-900">{documento.fecha}</span>
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sucursal:
                </label>
                <span className="text-sm text-gray-900">{documento.sucursal}</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Caja:
                </label>
                <span className="text-sm text-gray-900">{documento.caja}</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto:
                </label>
                <span className="text-sm text-gray-900 font-semibold">{documento.monto}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Vista previa del documento:</span>
            </h3>
            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm">Vista previa del documento</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
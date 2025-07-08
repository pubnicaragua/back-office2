import React from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';

interface DetalleDespachoProps {
  onBack: () => void;
}

export function DetalleDespacho({ onBack }: DetalleDespachoProps) {
  const productos = [
    { nombre: 'Pola - cola 500ml', sku: '9520401', cantidad: 20, costo: '$125' },
    { nombre: 'Pola - cola 1L', sku: '9520401', cantidad: 15, costo: '$25' },
    { nombre: 'Pola - cola 1.5L', sku: '9520401', cantidad: 30, costo: '$5' },
    { nombre: 'Pola - cola 3L', sku: '9520401', cantidad: 10, costo: '$5' },
    { nombre: 'Pola - cola 3L', sku: '9520401', cantidad: 10, costo: '$5' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-4">
            <img src="/logo_negro.svg" alt="Solvendo" className="h-8" />
            <h1 className="text-xl font-semibold text-gray-900">Gestión de despachos</h1>
          </div>
          <div className="ml-auto flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <img src="/logo_negro.svg" alt="Solvendo" className="h-8" />
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="font-medium">22:00</span>
              <span>🕐</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <span className="text-sm font-medium text-gray-900">Emilio Aguilera</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de productos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500">
                  <span>Producto</span>
                  <span>SKU</span>
                  <span>Cantidad</span>
                  <span>Costo unit</span>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {productos.map((producto, index) => (
                  <div key={index} className="px-6 py-4">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <span className="text-gray-900">{producto.nombre}</span>
                      <span className="text-gray-600">{producto.sku}</span>
                      <span className="text-gray-600">{producto.cantidad}</span>
                      <span className="text-gray-900 font-medium">{producto.costo}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-semibold text-gray-900">204 $</span>
                </div>
              </div>
            </div>
          </div>

          {/* Información lateral */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Despacho</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Entregado por:
                  </label>
                  <span className="text-sm text-gray-900">Emilio Aguilera</span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Folio:
                  </label>
                  <span className="text-sm text-gray-900">8949564506</span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha:
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-900">30/05/2025</span>
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recepcionado por:
                  </label>
                  <span className="text-sm text-gray-900">Pedro Hernández</span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RUT:
                  </label>
                  <span className="text-sm text-gray-900">54658425</span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección:
                  </label>
                  <span className="text-sm text-gray-900">Jr. Santiago de Chile 193</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Guía de despacho:</h3>
              <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-sm">Vista previa del documento</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
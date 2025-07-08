import React, { useState } from 'react';
import { Modal } from '../Common/Modal';
import { useSupabaseInsert } from '../../hooks/useSupabaseData';

interface ActualizarInventarioProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ActualizarInventario({ isOpen, onClose }: ActualizarInventarioProps) {
  const [productos] = useState([
    { nombre: 'Pola - cola 500ml', cantidad: 1, costo: '$125' },
    { nombre: 'Pola - cola 500ml', cantidad: 1, costo: '$125' },
    { nombre: 'Pola - cola 500ml', cantidad: 1, costo: '$125' },
    { nombre: 'Pola - cola 500ml', cantidad: 1, costo: '$125' },
  ]);

  const { insert, loading } = useSupabaseInsert('inventario');

  const handleConfirm = async () => {
    // Aquí iría la lógica para actualizar el inventario
    for (const producto of productos) {
      await insert({
        movimiento: 'entrada',
        cantidad: producto.cantidad,
        stock_final: producto.cantidad,
        referencia: 'Actualización manual',
        empresa_id: '00000000-0000-0000-0000-000000000000', // Temporal
        sucursal_id: '00000000-0000-0000-0000-000000000000', // Temporal
        producto_id: '00000000-0000-0000-0000-000000000000', // Temporal
      });
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Actualizar inventario" size="md">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-500 border-b pb-2">
          <span>Producto</span>
          <span>Cantidad</span>
          <span>Costo</span>
        </div>
        
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {productos.map((producto, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 text-sm">
              <span className="text-gray-900">{producto.nombre}</span>
              <span className="text-gray-600">{producto.cantidad}</span>
              <span className="text-gray-900">{producto.costo}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Actualizando...' : 'Confirmar inventario'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
import React, { useState } from 'react';
import { Table } from '../Common/Table';
import { DetallePedido } from './DetallePedido';
import { Filter, Plus, Download } from 'lucide-react';
import { useSupabaseData } from '../../hooks/useSupabaseData';

export function RecepcionPedidos() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetalle, setShowDetalle] = useState(false);

  const { data: pedidos, loading } = useSupabaseData<any>(
    'despachos',
    '*, usuarios(nombre), sucursales(nombre), clientes(razon_social)'
  );

  const columns = [
    { key: 'proveedor', label: 'Proveedor' },
    { key: 'folio', label: 'Folio factura' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'monto', label: 'Monto total' },
    { key: 'sucursal', label: 'Sucursal de captura' },
  ];

  const processedData = pedidos.map(pedido => ({
    proveedor: pedido.clientes?.razon_social || 'Proveedor',
    folio: pedido.folio || 'Folio factura',
    fecha: new Date(pedido.fecha).toLocaleDateString('es-CL'),
    monto: '$2000', // This would need to be calculated from related items
    sucursal: pedido.sucursales?.nombre || 'Sucursal de captura',
  }));

  if (loading) {
    return <div className="text-center py-4">Cargando pedidos...</div>;
  }

  if (showDetalle) {
    return <DetallePedido onBack={() => setShowDetalle(false)} />;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Recepción de pedidos</h1>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
          <button className="p-2 rounded-md hover:bg-gray-100">
            <Plus className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-md hover:bg-gray-100">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {processedData.map((row, index) => (
              <tr 
                key={index} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => index === 0 && setShowDetalle(true)}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-sm text-gray-900">
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              1
            </button>
            <button className="px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100">
              2
            </button>
            <button className="px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100">
              3
            </button>
            <span className="text-sm text-gray-500">Siguiente</span>
          </div>
        </div>
      </div>
    </div>
  );
}
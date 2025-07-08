import React, { useState } from 'react';
import { Table } from '../Common/Table';
import { DetalleDespacho } from '../Pedidos/DetalleDespacho';
import { useSupabaseData } from '../../hooks/useSupabaseData';

export function GestionDespachos() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetalle, setShowDetalle] = useState(false);

  const { data: despachos, loading } = useSupabaseData<any>(
    'despachos',
    '*, usuarios(nombres), sucursales(nombre)'
  );

  const columns = [
    { key: 'entregado_por', label: 'Entregado por' },
    { key: 'folio_factura', label: 'Folio de factura' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'monto_total', label: 'Monto total' },
    { key: 'estado', label: 'Estado' },
    { key: 'sucursal_destino', label: 'Sucursal de destino' },
  ];

  const processedData = despachos.map(despacho => ({
    entregado_por: despacho.usuarios?.nombres || 'Emilio Aguilera',
    folio_factura: despacho.folio || '8949564506',
    fecha: new Date(despacho.fecha).toLocaleDateString('es-CL') || '30/05/2025',
    monto_total: '$2000',
    estado: despacho.estado || 'Entregado',
    sucursal_destino: despacho.sucursales?.nombre || 'Tienda N°1',
  }));

  if (loading) {
    return <div className="text-center py-4">Cargando despachos...</div>;
  }

  if (showDetalle) {
    return <DetalleDespacho onBack={() => setShowDetalle(false)} />;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de despachos</h1>
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
                onClick={() => setShowDetalle(true)}
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
      </div>
    </div>
  );
}
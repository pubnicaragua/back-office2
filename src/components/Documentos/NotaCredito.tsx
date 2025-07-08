import React, { useState } from 'react';
import { Table } from '../Common/Table';
import { NotaCreditoDetalle } from './NotaCreditoDetalle';
import { FilterModal } from '../Common/FilterModal';
import { Filter } from 'lucide-react';

export function NotaCredito() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetalle, setShowDetalle] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const columns = [
    { key: 'tipo', label: 'Tipo de doc.' },
    { key: 'folio', label: 'Folio' },
    { key: 'fecha', label: 'Fecha y hora' },
    { key: 'monto', label: 'Monto' },
    { key: 'sucursal', label: 'Sucursal' },
    { key: 'caja', label: 'Caja' },
  ];

  const data = [
    {
      tipo: 'Manual',
      folio: '8949564506',
      fecha: '28/05/2025 20:00',
      monto: '$ 1,523',
      sucursal: 'N°1',
      caja: 'N°1',
    },
    {
      tipo: 'Electrónica',
      folio: '8949564506',
      fecha: '28/05/2025 20:00',
      monto: '$ 1,523',
      sucursal: 'N°1',
      caja: 'N°1',
    },
    {
      tipo: 'Electrónica',
      folio: '8949564506',
      fecha: '28/05/2025 20:00',
      monto: '$ 1,523',
      sucursal: 'N°1',
      caja: 'N°1',
    },
    {
      tipo: 'Electrónica',
      folio: '8949564506',
      fecha: '28/05/2025 20:00',
      monto: '$ 1,523',
      sucursal: 'N°1',
      caja: 'N°1',
    },
    {
      tipo: 'Electrónica',
      folio: '8949564506',
      fecha: '28/05/2025 20:00',
      monto: '$ 1,523',
      sucursal: 'N°1',
      caja: 'N°1',
    },
  ];

  if (showDetalle) {
    return <NotaCreditoDetalle onBack={() => setShowDetalle(false)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Nota de crédito</h2>
        <button 
          onClick={() => setShowFilters(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Filter className="w-4 h-4" />
          <span>Filtros</span>
        </button>
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
            {data.map((row, index) => (
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

      <FilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filtros"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha / hora
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sucursal
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todas las sucursales</option>
              <option value="n1">N°1</option>
              <option value="n2">N°2</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cajas
            </label>
            <div className="space-y-2">
              {['Caja N°1', 'Caja N°2', 'Caja N°3', 'Caja N°4'].map(caja => (
                <label key={caja} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{caja}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </FilterModal>
    </div>
  );
}
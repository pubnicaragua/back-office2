import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { FilterModal } from '../Common/FilterModal';

export function MovimientosEfectivo() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sucursal: '',
    tipo: '',
    fecha: ''
  });
  
  const { data: movimientos, loading, error } = useSupabaseData<any>('movimientos_caja', '*');

  // Apply filters
  const filteredMovimientos = (movimientos || []).filter(movimiento => {
    if (filters.sucursal && movimiento.sucursal_id !== filters.sucursal) return false;
    if (filters.tipo && movimiento.tipo !== filters.tipo) return false;
    if (filters.fecha && !new Date(movimiento.fecha).toISOString().includes(filters.fecha)) return false;
    return true;
  });

  if (loading) {
    return <div className="text-center py-4">Cargando movimientos...</div>;
  }

  return (
    <div className="flex">
      {/* Vertical Sidebar - Fixed position on the left */}
      <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-40">
        <div className="w-20 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
          <div className="flex flex-col space-y-3">
            <button 
              onClick={() => setShowFilters(true)}
              className="p-3 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors group relative"
              title="Filtros"
            >
              <Filter className="w-5 h-5" />
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Filtros
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content with left margin */}
      <div className="flex-1 ml-24 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Movimientos de efectivo</h2>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Retiros / Ingresos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha y hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sucursales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Caja
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMovimientos.map((movimiento, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {movimiento.tipo === 'retiro' ? 'Retiro' : 'Ingreso'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {movimiento.tipo === 'retiro' ? '- ' : '+ '}
                    ${parseFloat(movimiento.monto || 0).toLocaleString('es-CL')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(movimiento.fecha).toLocaleString('es-CL')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    N°1
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    N°1
                  </td>
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
                Sucursal
              </label>
              <select 
                value={filters.sucursal}
                onChange={(e) => setFilters(prev => ({ ...prev, sucursal: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las sucursales</option>
                <option value="00000000-0000-0000-0000-000000000001">Sucursal N°1</option>
                <option value="00000000-0000-0000-0000-000000000002">Sucursal N°2</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de movimiento
              </label>
              <select 
                value={filters.tipo}
                onChange={(e) => setFilters(prev => ({ ...prev, tipo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="ingreso">Ingreso</option>
                <option value="retiro">Retiro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha
              </label>
              <input
                type="date"
                value={filters.fecha}
                onChange={(e) => setFilters(prev => ({ ...prev, fecha: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </FilterModal>
      </div>
    </div>
  );
}
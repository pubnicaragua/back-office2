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
  
  const { data: movimientos, loading, error } = useSupabaseData<any>(
    'movimientos_caja', 
    '*, sucursales(nombre)'
  );

  // Apply filters
  const filteredMovimientos = movimientos.filter(movimiento => {
    if (filters.sucursal && movimiento.sucursal_id !== filters.sucursal) return false;
    if (filters.tipo && movimiento.tipo !== filters.tipo) return false;
    if (filters.fecha && !new Date(movimiento.fecha).toISOString().includes(filters.fecha)) return false;
    return true;
  });

  if (loading) {
    return <div className="text-center py-4">Cargando movimientos...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Movimientos de efectivo</h2>
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
                  {movimiento.sucursales?.nombre || 'N°1'}
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
  );
}
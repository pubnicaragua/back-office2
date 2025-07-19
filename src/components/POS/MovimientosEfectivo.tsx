import React, { useState } from 'react';
import { Table } from '../Common/Table';
import { FilterModal } from '../Common/FilterModal';
import { Filter } from 'lucide-react';
import { useSupabaseData } from '../../hooks/useSupabaseData';

export function MovimientosEfectivo() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sucursal: '',
    caja: '',
    fecha: '',
    tipo: ''
  });
  
  const { data: movimientos, loading, error } = useSupabaseData<any>(
    'movimientos_caja', 
    '*, sucursales(nombre), usuarios(nombres)'
  );
  const { data: sucursales } = useSupabaseData<any>('sucursales', '*');
  const { data: cajas } = useSupabaseData<any>('cajas', '*');

  const columns = [
    { key: 'tipo', label: 'Retiro / Ingreso' },
    { key: 'monto', label: 'Monto' },
    { key: 'fecha', label: 'Fecha y hora' },
    { key: 'sucursal', label: 'Sucursales' },
    { key: 'caja', label: 'Caja' },
  ];

  // Aplicar filtros
  const filteredMovimientos = movimientos.filter(movimiento => {
    if (filters.sucursal && filters.sucursal !== '' && movimiento.sucursal_id !== filters.sucursal) return false;
    if (filters.tipo && filters.tipo !== '' && movimiento.tipo !== filters.tipo) return false;
    if (filters.fecha && filters.fecha !== '' && !new Date(movimiento.fecha).toISOString().includes(filters.fecha)) return false;
    return true;
  });

  const processedData = filteredMovimientos.map((movimiento) => ({
    tipo: movimiento.tipo === 'ingreso' ? 'Ingreso' : 'Retiro',
    monto: `$ ${parseFloat(movimiento.monto || 0).toLocaleString('es-CL')}`,
    fecha: new Date(movimiento.fecha).toLocaleString('es-CL'),
    sucursal: movimiento.sucursales?.nombre || 'N°1',
    caja: 'N°1', // Podrías agregar relación con cajas
  }));

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

      <Table
        columns={columns}
        data={processedData}
        currentPage={currentPage}
        totalPages={Math.ceil(processedData.length / 10)}
        onPageChange={setCurrentPage}
      />

      <FilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filtros"
        filters={filters}
        onFilterChange={setFilters}
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
              {sucursales.map(sucursal => (
                <option key={sucursal.id} value={sucursal.id}>{sucursal.nombre}</option>
              ))}
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
        </div>
      </FilterModal>
    </div>
  );
}
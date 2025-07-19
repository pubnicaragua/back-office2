import React, { useState } from 'react';
import { Table } from '../Common/Table';
import { FilterModal } from '../Common/FilterModal';
import { Filter, Search, Plus, Edit, Download } from 'lucide-react';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { AgregarPromocionModal } from './AgregarPromocionModal';
import { EditarPromocionModal } from './EditarPromocionModal';

interface PromocionesTodasProps {
  onShowModal: () => void;
}

export function PromocionesTodas({ onShowModal }: PromocionesTodasProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);

  const { data: promociones, loading, error } = useSupabaseData<any>('promociones', '*');

  const columns = [
    { key: 'nombre', label: 'Promoción' },
    { key: 'numero_limite', label: 'Número límite' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'sucursal', label: 'Sucursal' },
    { key: 'costo', label: 'Costo' },
    { key: 'precio', label: 'Precio' },
    { key: 'disponible', label: 'Disponible' },
  ];

  const processedData = promociones.map(promocion => ({
    nombre: promocion.nombre,
    numero_limite: promocion.numero_limite?.toString() || '50',
    descripcion: promocion.descripcion,
    sucursal: 'N°1',
    costo: `Costo: ${Math.round(promocion.costo || 0)} $`,
    precio: `Precio: ${Math.round(promocion.precio_prom)} $`,
    disponible: promocion.disponible ? 'Disponible' : 'No disponible',
  }));

  const filteredData = processedData.filter(item =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-4">Cargando promociones...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-gray-500">No hay promociones disponibles</div>;
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Promociones de todas las tiendas</h2>
        <button 
          onClick={() => setShowFilters(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Filter className="w-4 h-4" />
          <span>Filtros</span>
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowAgregarModal(true)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowEditarModal(true)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-sm text-gray-900">
                    {row[column.key]}
                  </td>
                ))}
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setShowEditarModal(true)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ✏️
                    </button>
                    <button className="text-blue-600 hover:text-blue-800">
                      📥
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AgregarPromocionModal 
        isOpen={showAgregarModal} 
        onClose={() => setShowAgregarModal(false)} 
      />

      <EditarPromocionModal 
        isOpen={showEditarModal} 
        onClose={() => setShowEditarModal(false)} 
      />

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
            <div className="grid grid-cols-2 gap-2">
              {['N°1', 'N°2', 'N°3', 'N°4'].map(sucursal => (
                <label key={sucursal} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{sucursal}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </FilterModal>
    </div>
  );
}
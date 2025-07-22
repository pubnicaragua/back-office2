import React, { useState } from 'react';
import { Table } from '../Common/Table';
import { Filter, Search, Plus, Edit, Download } from 'lucide-react';
import { useSupabaseData, useSupabaseUpdate } from '../../hooks/useSupabaseData';
import { AgregarPromocionModal } from './AgregarPromocionModal';
import { EditarPromocionModal } from './EditarPromocionModal';
import { Modal } from '../Common/Modal';

interface PromocionesTodasProps {
  onShowModal: () => void;
}

export function PromocionesTodas({ onShowModal }: PromocionesTodasProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [selectedPromocion, setSelectedPromocion] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: promociones, loading, error, refetch } = useSupabaseData<any>('promociones', '*');
  const { update: updatePromocion } = useSupabaseUpdate('promociones');

  const columns = [
    { key: 'nombre', label: 'Promoción' },
    { key: 'numero_limite', label: 'Número límite' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'sucursal', label: 'Sucursal' },
    { key: 'costo', label: 'Costo' },
    { key: 'precio', label: 'Precio' },
    { key: 'disponible', label: 'Disponible' },
  ];

  const processedData = (promociones || []).map(promocion => ({
    id: promocion.id,
    nombre: promocion.nombre,
    numero_limite: promocion.numero_limite?.toString() || '50',
    descripcion: promocion.descripcion,
    sucursal: 'N°1',
    costo: `Costo: ${Math.round(promocion.costo || 0)} $`,
    precio: `Precio: ${Math.round(promocion.precio_prom)} $`,
    disponible: promocion.disponible ? 'Disponible' : 'No disponible',
    promocion: promocion
  }));

  const filteredData = processedData.filter(item =>
    (searchTerm === '' || 
     item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEditPromocion = (promocion) => {
    setSelectedPromocion(promocion);
    setShowEditarModal(true);
  };

  const handleDeletePromocion = (promocion) => {
    setSelectedPromocion(promocion);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedPromocion) {
      const success = await updatePromocion(selectedPromocion.id, { activo: false });
      if (success) {
        setShowDeleteModal(false);
        setSelectedPromocion(null);
        refetch();
      }
    }
  };

  const handleDownloadReport = () => {
    try {
      const headers = ['Promoción', 'Límite', 'Descripción', 'Sucursal', 'Costo', 'Precio'];
      const csvContent = [
        headers.join('\t'),
        ...filteredData.map(p => [
          p.nombre,
          p.numero_limite,
          p.descripcion,
          p.sucursal,
          p.costo,
          p.precio
        ].join('\t'))
      ].join('\n');
    
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_promociones_${new Date().toISOString().split('T')[0]}.xls`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Error al descargar el reporte.');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Cargando promociones...</div>;
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
            
            <button 
              onClick={() => setShowAgregarModal(true)}
              className="p-3 rounded-lg hover:bg-green-50 text-green-600 transition-colors group relative"
              title="Agregar Promoción"
            >
              <Plus className="w-5 h-5" />
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Agregar
              </span>
            </button>
            
            <button 
              onClick={() => setShowEditarModal(true)}
              className="p-3 rounded-lg hover:bg-yellow-50 text-yellow-600 transition-colors group relative"
              title="Editar Promoción"
            >
              <Edit className="w-5 h-5" />
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Editar
              </span>
            </button>
            
            <button 
              onClick={handleDownloadReport}
              className="p-3 rounded-lg hover:bg-purple-50 text-purple-600 transition-colors group relative"
              title="Descargar Reporte"
            >
              <Download className="w-5 h-5" />
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Descargar
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content with left margin */}
      <div className="flex-1 ml-24 space-y-6">
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
                        onClick={() => handleEditPromocion(row)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDeletePromocion(row)}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑️
                      </button>
                      <button className="text-green-600 hover:text-green-800">
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
          promocion={selectedPromocion}
          onSuccess={() => {
            setShowEditarModal(false);
            setSelectedPromocion(null);
            refetch();
          }}
        />

        {/* Modal de Filtros */}
        <Modal
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          title="Filtros"
          size="md"
        >
          <div className="space-y-4">
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
                Estado
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Todos</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Eliminar Promoción"
          size="sm"
        >
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              ¿Estás seguro de que deseas eliminar la promoción "{selectedPromocion?.nombre}"?
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
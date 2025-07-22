import React, { useState } from 'react';
import { Filter, Search, Plus, Edit, Download } from 'lucide-react';
import { useSupabaseData, useSupabaseUpdate, useSupabaseInsert } from '../../hooks/useSupabaseData';
import { AgregarPromocionModal } from './AgregarPromocionModal';
import { EditarPromocionModal } from './EditarPromocionModal';
import { Modal } from '../Common/Modal';
import { posSync } from '../../lib/posApiSync';

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
  const [filters, setFilters] = useState({
    sucursal: '',
    estado: '',
    tipo: ''
  });

  const { data: promociones, loading, error, refetch } = useSupabaseData<any>('promociones', '*, sucursales(nombre)');
  const { data: sucursales } = useSupabaseData<any>('sucursales', '*');
  const { update: updatePromocion } = useSupabaseUpdate('promociones');

  // Apply filters to data
  const filteredPromociones = (promociones || []).filter(promocion => {
    if (filters.sucursal && promocion.sucursal_id !== filters.sucursal) return false;
    if (filters.estado && (promocion.activo ? 'activo' : 'inactivo') !== filters.estado) return false;
    if (filters.tipo && promocion.tipo !== filters.tipo) return false;
    return true;
  });

  const processedData = filteredPromociones.map(promocion => ({
    id: promocion.id,
    nombre: promocion.nombre,
    numero_limite: promocion.numero_limite?.toString() || '50',
    descripcion: promocion.descripcion,
    sucursal: promocion.sucursales?.nombre || 'Todas',
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
        // Sync to POS terminals
        await posSync.onProductAdded(selectedPromocion);
        setShowDeleteModal(false);
        setSelectedPromocion(null);
        refetch();
      }
    }
  };

  const handleDownloadReport = () => {
    try {
      const headers = ['Promoción', 'Número límite', 'Descripción', 'Sucursal', 'Costo', 'Precio', 'Disponible'];
      const csvContent = [
        headers.join('\t'),
        ...filteredData.map(p => [
          p.nombre,
          p.numero_limite,
          p.descripcion,
          p.sucursal,
          p.costo,
          p.precio,
          p.disponible
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Promociones de todas las tiendas</h2>
      </div>

      {/* Action buttons row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowFilters(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
          <button 
            onClick={() => setShowAgregarModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar</span>
          </button>
          <button 
            onClick={() => setShowEditarModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Editar</span>
          </button>
          <button 
            onClick={handleDownloadReport}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Descargar</span>
          </button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promoción</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número límite</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sucursal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disponible</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{row.nombre}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{row.numero_limite}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{row.descripcion}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{row.sucursal}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{row.costo}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{row.precio}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{row.disponible}</td>
                <td className="px-6 py-4 text-sm">
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
              Estado
            </label>
            <select 
              value={filters.estado}
              onChange={(e) => setFilters(prev => ({ ...prev, estado: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select 
              value={filters.tipo}
              onChange={(e) => setFilters(prev => ({ ...prev, tipo: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los tipos</option>
              <option value="2x1">2x1</option>
              <option value="descuento">Descuento</option>
              <option value="combo">Combo</option>
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
  );
}
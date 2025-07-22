import React, { useState } from 'react';
import { Table } from '../Common/Table';
import { FilterModal } from '../Common/FilterModal';
import { Filter, Plus, Search, AlertTriangle } from 'lucide-react';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { ReporteMermas } from './ReporteMermas';
import { ActualizarInventario } from './ActualizarInventario';
import { AgregarProductoModal } from './AgregarProductoModal';

export function ProductosTotales() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    sucursal: '',
    categoria: '',
    disponibilidad: ''
  });
  const [showMermasModal, setShowMermasModal] = useState(false);
  const [showInventarioModal, setShowInventarioModal] = useState(false);
  const [showProductoModal, setShowProductoModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { data: productos, loading, refetch } = useSupabaseData<any>(
    'productos',
    '*'
  );
  const { data: sucursales } = useSupabaseData<any>('sucursales', '*');
  const { data: categorias } = useSupabaseData<any>('categorias', '*');

  const columns = [
    { key: 'producto', label: 'Producto' },
    { key: 'stock', label: 'Stock' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'sku', label: 'SKU' },
    { key: 'costo', label: 'Costo' },
    { key: 'precio', label: 'Precio' },
    { key: 'disponible', label: 'Disponible' },
  ];

  // Aplicar filtros
  const filteredProductos = productos.filter(producto => {
    if (filters.categoria && filters.categoria !== '') {
      const categoria = categorias.find(c => c.nombre.toLowerCase() === filters.categoria.toLowerCase());
      if (categoria && producto.categoria_id !== categoria.id) return false;
    }
    if (filters.disponibilidad === 'disponibles' && (producto.stock || 0) <= 0) return false;
    if (filters.disponibilidad === 'agotados' && (producto.stock || 0) > 0) return false;
    return true;
  });

  const processedData = filteredProductos.map(producto => ({
    id: producto.id,
    producto: producto.nombre,
    stock: producto.stock?.toString() || '0',
    categoria: categorias.find(c => c.id === producto.categoria_id)?.nombre || 'Sin categoría',
    descripcion: producto.descripcion || '',
    sku: producto.codigo,
    costo: `Costo: ${Math.round((producto.costo || 0))} $`,
    precio: `Precio: ${Math.round((producto.precio || 0))} $`,
    disponible: producto.stock > 0 ? 'Disponible' : 'Agotado',
  }));

  const filteredData = processedData.filter(item =>
    item.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Productos totales</h1>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowFilters(true)}
            className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filtros
          </button>
          <button 
            onClick={() => setShowProductoModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Agregar
          </button>
          <button 
            onClick={() => setShowMermasModal(true)}
            className="flex items-center px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
          >
            <AlertTriangle className="w-5 h-5 mr-2" />
            Mermas
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mb-4">
        <button 
          onClick={() => setShowInventarioModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Actualizar inventario
        </button>
      </div>

      <Table
        columns={columns}
        data={filteredData}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredData.length / 10)}
        onPageChange={setCurrentPage}
      />

      <ReporteMermas 
        isOpen={showMermasModal} 
        onClose={() => setShowMermasModal(false)} 
      />
      
      <ActualizarInventario 
        isOpen={showInventarioModal} 
        onClose={() => setShowInventarioModal(false)} 
      />
      
      <AgregarProductoModal 
        isOpen={showProductoModal} 
        onClose={() => setShowProductoModal(false)} 
      />

      <FilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filtros"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Todas las sucursales
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todas las sucursales</option>
              <option value="n1">N°1</option>
              <option value="n2">N°2</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Productos totales
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Productos totales</option>
              <option value="disponibles">Disponibles</option>
              <option value="agotados">Agotados</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categorías
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todas las categorías</option>
              <option value="bebidas">Bebidas</option>
              <option value="snacks">Snacks</option>
            </select>
          </div>
        </div>
      </FilterModal>
    </div>
  );
}
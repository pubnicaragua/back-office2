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
    if (filters.categoria && filters.categoria !== '' && producto.categoria_id !== filters.categoria) return false;
    if (filters.disponibilidad === 'disponibles' && (producto.stock || 0) <= 0) return false;
    if (filters.disponibilidad === 'agotados' && (producto.stock || 0) > 0) return false;
    return true;
  });

  const processedData = filteredProductos.map(producto => ({
    id: producto.id,
    producto: producto.nombre,
    stock: producto.stock?.toString() || '0',
    categoria: producto.categorias?.nombre || 'Sin categoría',
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

  if (loading) {
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
              onClick={() => setShowProductoModal(true)}
              className="p-3 rounded-lg hover:bg-green-50 text-green-600 transition-colors group relative"
              title="Agregar Producto"
            >
              <Plus className="w-5 h-5" />
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Agregar
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-24">
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Productos totales</h2>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
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
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Table } from '../Common/Table';
import { FilterModal } from '../Common/FilterModal';
import { Search, Plus, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import { AgregarClienteModal } from './AgregarClienteModal';

export function GestionClientes() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAgregarModal, setShowAgregarModal] = useState(false);

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'rut', label: 'RUT' },
    { key: 'email', label: 'Email' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'ultima_compra', label: 'Última compra' },
    { key: 'total_compras', label: 'Total compras' },
    { key: 'acciones', label: 'Acciones' },
  ];

  const data = [
    {
      nombre: 'Juan Pérez',
      rut: '12.345.678-9',
      email: 'juan@email.com',
      telefono: '+56 9 1234 5678',
      ultima_compra: '15/12/2024',
      total_compras: '$125.000',
      acciones: (
        <div className="flex space-x-2">
          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-1 text-green-600 hover:bg-green-50 rounded">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-1 text-red-600 hover:bg-red-50 rounded">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
    {
      nombre: 'María González',
      rut: '98.765.432-1',
      email: 'maria@email.com',
      telefono: '+56 9 8765 4321',
      ultima_compra: '10/12/2024',
      total_compras: '$89.500',
      acciones: (
        <div className="flex space-x-2">
          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-1 text-green-600 hover:bg-green-50 rounded">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-1 text-red-600 hover:bg-red-50 rounded">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const filteredData = data.filter(item =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.rut.includes(searchTerm) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Gestión de clientes</h2>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowFilters(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
          <button 
            onClick={() => setShowAgregarModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar cliente</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Buscar clientes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <Table
        columns={columns}
        data={filteredData}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredData.length / 10)}
        onPageChange={setCurrentPage}
      />

      <AgregarClienteModal 
        isOpen={showAgregarModal} 
        onClose={() => setShowAgregarModal(false)} 
      />

      <FilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filtros de clientes"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de cliente
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todos</option>
              <option value="frecuente">Frecuente</option>
              <option value="nuevo">Nuevo</option>
              <option value="vip">VIP</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rango de compras
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todos</option>
              <option value="0-50000">$0 - $50.000</option>
              <option value="50000-100000">$50.000 - $100.000</option>
              <option value="100000+">$100.000+</option>
            </select>
          </div>
        </div>
      </FilterModal>
    </div>
  );
}
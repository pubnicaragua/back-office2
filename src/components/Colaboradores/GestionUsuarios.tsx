import React, { useState } from 'react';
import { Table } from '../Common/Table';
import { FilterModal } from '../Common/FilterModal';
import { Search, Plus, Mail, Clock, Filter } from 'lucide-react';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { AgregarUsuarioModal } from './AgregarUsuarioModal';
import { AsignarTiempoModal } from './AsignarTiempoModal';
import { EnviarComunicadoModal } from './EnviarComunicadoModal';
import { PerfilEmpleadoModal } from './PerfilEmpleadoModal';

export function GestionUsuarios() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showTiempoModal, setShowTiempoModal] = useState(false);
  const [showComunicadoModal, setShowComunicadoModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showPerfilModal, setShowPerfilModal] = useState(false);

  const { data: usuarios, loading, error } = useSupabaseData<any>('usuarios', '*');

  const columns = [
    { key: 'nombres', label: 'Nombres' },
    { key: 'rut', label: 'RUT' },
    { key: 'edad', label: 'Edad' },
    { key: 'rol', label: 'Rol' },
  ];

  const processedData = usuarios.map(usuario => {
    const edad = Math.floor(Math.random() * 20) + 25; // Random age between 25-45
    
    return {
      id: usuario.id,
      nombres: `${usuario.nombres} ${usuario.apellidos}`,
      rut: usuario.rut,
      edad: edad.toString(),
      rol: 'Empleado',
      usuario: usuario
    };
  });

  const filteredData = processedData.filter(item =>
    item.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.rut.includes(searchTerm)
  );

  const handleViewPerfil = (userData) => {
    setShowPerfilModal(true);
  };
  if (loading) {
    return <div className="text-center py-4">Cargando usuarios...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">Error: {error}</div>;
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Gestión de usuarios</h2>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowComunicadoModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Mail className="w-4 h-4" />
            <span>Enviar comunicado general</span>
          </button>
          <button 
            onClick={() => setShowTiempoModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Clock className="w-4 h-4" />
            <span>Asignar tiempo de colación</span>
          </button>
          <button 
            onClick={() => setShowFilters(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
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
          onClick={() => setShowAgregarModal(true)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
        >
          <Plus className="w-5 h-5" />
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
            {filteredData.map((row, index) => (
              <tr 
                key={index} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleViewPerfil(row)}
              >
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <span className="text-gray-900">{row.nombres}</span>
                  </div>
                </td>
                {columns.slice(1).map((column) => (
                  <td key={column.key} className="px-4 py-3 text-sm text-gray-900">
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AgregarUsuarioModal 
        isOpen={showAgregarModal} 
        onClose={() => setShowAgregarModal(false)} 
      />
      
      <AsignarTiempoModal 
        isOpen={showTiempoModal} 
        onClose={() => setShowTiempoModal(false)} 
      />
      
      <EnviarComunicadoModal 
        isOpen={showComunicadoModal} 
        onClose={() => setShowComunicadoModal(false)} 
      />

      <PerfilEmpleadoModal 
        isOpen={showPerfilModal} 
        onClose={() => setShowPerfilModal(false)} 
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
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todas las sucursales</option>
              <option value="n1">N°1</option>
              <option value="n2">N°2</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hora
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Seleccionar hora</option>
              <option value="morning">Mañana</option>
              <option value="afternoon">Tarde</option>
            </select>
          </div>
        </div>
      </FilterModal>
    </div>
  );
}
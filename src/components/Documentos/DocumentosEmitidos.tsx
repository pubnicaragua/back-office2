import React, { useState } from 'react';
import { FilterModal } from '../Common/FilterModal';
import { Filter, Eye } from 'lucide-react';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { DocumentoDetalleModal } from './DocumentoDetalleModal';

export function DocumentosEmitidos() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    fecha: '',
    sucursal: '',
    caja: '',
    tipo: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showDetalle, setShowDetalle] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const { data: ventas, loading } = useSupabaseData<any>(
    'ventas',
    '*, sucursales(nombre)'
  );
  const { data: sucursales } = useSupabaseData<any>('sucursales', '*');

  const columns = [
    { key: 'tipo', label: 'Tipo de doc.' },
    { key: 'folio', label: 'Folio' },
    { key: 'fecha', label: 'Fecha y hora' },
    { key: 'monto', label: 'Monto' },
    { key: 'sucursal', label: 'Sucursales' },
    { key: 'caja', label: 'Caja' },
  ];

  // Aplicar filtros
  const filteredVentas = ventas.filter(venta => {
    if (filters.fecha && !new Date(venta.fecha).toISOString().includes(filters.fecha)) return false;
    if (filters.sucursal && venta.sucursal_id !== filters.sucursal) return false;
    if (filters.tipo && venta.tipo_dte !== filters.tipo) return false;
    return true;
  });

  const processedData = filteredVentas.map(venta => ({
    id: venta.id,
    tipo: venta.tipo_dte === 'boleta' ? 'Boleta' : venta.tipo_dte === 'factura' ? 'Factura' : 'Nota de Crédito',
    folio: venta.folio,
    fecha: new Date(venta.fecha).toLocaleString('es-CL'),
    monto: `$ ${parseFloat(venta.total || 0).toLocaleString('es-CL')}`,
    sucursal: venta.sucursales?.nombre || 'N°1',
    caja: 'N°1',
  }));

  const handleViewDetalle = (documento) => {
    setSelectedDocument(documento);
    setShowDetalle(true);
  };

  if (loading) {
    return <div className="text-center py-4">Cargando documentos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Documentos emitidos</h2>
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
            {processedData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-sm text-gray-900">
                    {row[column.key]}
                  </td>
                ))}
                <td className="px-4 py-3 text-sm">
                  <button 
                    onClick={() => handleViewDetalle(row)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filtros"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha / hora
            </label>
            <input
              type="date"
              value={filters.fecha}
              onChange={(e) => setFilters(prev => ({ ...prev, fecha: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
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
              Cajas
            </label>
            <select 
              value={filters.caja}
              onChange={(e) => setFilters(prev => ({ ...prev, caja: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las cajas</option>
              {cajas.map(caja => (
                <option key={caja.id} value={caja.id}>{caja.nombre}</option>
              ))}
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

      <DocumentoDetalleModal 
        isOpen={showDetalle} 
        onClose={() => setShowDetalle(false)}
        documento={selectedDocument}
      />
    </div>
  );
}
import React, { useState } from 'react';
import { DetallePedido } from './DetallePedido';
import { Filter, Plus, Download } from 'lucide-react';
import { useSupabaseData, useSupabaseInsert } from '../../hooks/useSupabaseData';
import { Modal } from '../Common/Modal';

export function RecepcionPedidos() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetalle, setShowDetalle] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [filters, setFilters] = useState({
    proveedor: '',
    fecha: '',
    estado: ''
  });

  const { data: pedidos, loading, refetch } = useSupabaseData<any>(
    'pedidos',
    '*'
  );
  const { insert, loading: inserting } = useSupabaseInsert('pedidos');

  const columns = [
    { key: 'proveedor', label: 'Proveedor' },
    { key: 'folio', label: 'Folio factura' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'monto', label: 'Monto total' },
    { key: 'sucursal', label: 'Sucursal de captura' },
  ];

  const processedData = pedidos.map(pedido => ({
    proveedor: 'Pola - rola',
    folio: pedido.id?.slice(0, 8) || 'N/A',
    fecha: '30/05/2025',
    monto: `$${pedido.total?.toLocaleString('es-CL') || '0'}`,
    sucursal: 'Sucursal N°1',
  }));

  const filteredData = processedData.filter(item => {
    if (filters.proveedor && filters.proveedor !== '' && !item.proveedor.toLowerCase().includes(filters.proveedor.toLowerCase())) return false;
    if (filters.fecha && filters.fecha !== '' && !item.fecha.includes(filters.fecha)) return false;
    if (filters.estado && item.estado !== filters.estado) return false;
    return true;
  });

  const handleAgregarPedido = async () => {
    // Generar folio único
    const folio = `PED-${Date.now()}`;
    
    // Verificar si ya existe un pedido con este folio
    const { data: existingPedido } = await supabase
      .from('pedidos')
      .select('id')
      .eq('folio', folio)
      .single();
    
    if (existingPedido) {
      alert('Ya existe un pedido con este folio. Intente nuevamente.');
      return;
    }
    
    const success = await insert({
      empresa_id: '00000000-0000-0000-0000-000000000001',
      sucursal_id: '00000000-0000-0000-0000-000000000001',
      proveedor_id: '00000000-0000-0000-0000-000000000001',
      folio: folio,
      total: 2000,
      estado: 'pendiente'
    });

    if (success) {
      setShowAgregarModal(false);
      refetch();
    }
  };

  const handleDownloadReport = () => {
    try {
      const headers = ['Proveedor', 'Folio', 'Fecha', 'Monto', 'Sucursal'];
      const csvContent = [
        headers.join('\t'),
        ...filteredData.map(p => [
          p.proveedor,
          p.folio,
          p.fecha,
          p.monto,
          p.sucursal
        ].join('\t'))
      ].join('\n');
    
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_pedidos_${new Date().toISOString().split('T')[0]}.xls`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Error al descargar el reporte.');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Cargando pedidos...</div>;
  }

  if (showDetalle) {
    return <DetallePedido onBack={() => setShowDetalle(false)} />;
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
              title="Agregar Pedido"
            >
              <Plus className="w-5 h-5" />
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Agregar
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 ml-24">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                  onClick={() => setShowDetalle(true)}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 text-sm text-gray-900">
                      {row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination */}
          <div className="flex items-center justify-center px-6 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100">
                2
              </button>
              <button className="px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100">
                3
              </button>
              <button className="px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100">
                Siguiente
              </button>
            </div>
          </div>
        </div>

        {/* Modals */}
        <Modal
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          title="Filtros"
          size="md"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                id="reset-filters-pedidos"
                onChange={(e) => {
                  if (e.target.checked) {
                    console.log('🔄 RESTABLECIENDO FILTROS PEDIDOS');
                    setFilters({ proveedor: '', fecha: '', estado: '' });
                  }
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="reset-filters-pedidos" className="text-sm text-gray-700">
                Restablecer filtros
              </label>
            </div>
            
            <div>
              <label htmlFor="proveedor-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Proveedor
              </label>
              <input
                id="proveedor-filter"
                name="proveedor-filter"
                type="text"
                value={filters.proveedor}
                onChange={(e) => {
                  console.log('🔍 FILTRO PROVEEDOR:', e.target.value);
                  setFilters(prev => ({ ...prev, proveedor: e.target.value }));
                }}
                placeholder="Buscar proveedor..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="fecha-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha
              </label>
              <input
                id="fecha-filter"
                name="fecha-filter"
                type="date"
                value={filters.fecha}
                onChange={(e) => {
                  console.log('📅 FILTRO FECHA:', e.target.value);
                  setFilters(prev => ({ ...prev, fecha: e.target.value }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => {
                  console.log('✅ APLICANDO FILTROS PEDIDOS:', filters);
                  setShowFilters(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={showAgregarModal}
          onClose={() => setShowAgregarModal(false)}
          title="Agregar Pedido"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              ¿Deseas agregar un nuevo pedido?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAgregarModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleAgregarPedido}
                disabled={inserting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {inserting ? 'Agregando...' : 'Agregar'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
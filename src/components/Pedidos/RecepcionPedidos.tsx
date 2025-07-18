import React, { useState } from 'react';
import { Table } from '../Common/Table';
import { DetallePedido } from './DetallePedido';
import { Filter, Plus, Download } from 'lucide-react';
import { useSupabaseData } from '../../hooks/useSupabaseData';

export function RecepcionPedidos() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetalle, setShowDetalle] = useState(false);

  const { data: pedidos, loading } = useSupabaseData<any>(
    'pedidos',
    '*, sucursales(nombre), clientes(razon_social)'
  );

  const columns = [
    { key: 'proveedor', label: 'Proveedor' },
    { key: 'folio', label: 'Folio factura' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'monto', label: 'Monto total' },
    { key: 'sucursal', label: 'Sucursal de captura' },
  ];

  const processedData = pedidos.map(pedido => ({
    proveedor: pedido.clientes?.razon_social || 'Pola - cola',
    folio: pedido.folio || '8949564506',
    fecha: new Date(pedido.fecha).toLocaleDateString('es-CL'),
    monto: `$${pedido.monto_total?.toLocaleString('es-CL') || '2000'}`,
    sucursal: pedido.sucursales?.nombre || 'Sucursal de captura',
  }));

  if (loading) {
    return <div className="text-center py-4">Cargando pedidos...</div>;
  }

  if (showDetalle) {
    return <DetallePedido onBack={() => setShowDetalle(false)} />;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Recepción de pedidos</h1>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
          <button className="p-2 rounded-md hover:bg-gray-100">
            <Plus className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-md hover:bg-gray-100">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <Table
        columns={columns}
        data={processedData}
        currentPage={currentPage}
        totalPages={Math.ceil(processedData.length / 10)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
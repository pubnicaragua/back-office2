import React, { useState } from 'react';
import { Table } from '../Common/Table';
import { DetalleDespacho } from '../Pedidos/DetalleDespacho';
import { useSupabaseData } from '../../hooks/useSupabaseData';

export function GestionDespachos() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetalle, setShowDetalle] = useState(false);

  const { data: pedidos, loading, error } = useSupabaseData<any>(
    'pedidos',
    '*'
  );

  const columns = [
    { key: 'entregado_por', label: 'Entregado por' },
    { key: 'folio_factura', label: 'Folio de factura' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'monto_total', label: 'Monto total' },
    { key: 'estado', label: 'Estado' },
    { key: 'sucursal_destino', label: 'Sucursal de destino' },
  ];

  const processedData = pedidos.map(pedido => ({
    entregado_por: 'Emilio Aguilera',
    folio_factura: pedido.id?.slice(0, 8) || 'N/A',
    fecha: new Date(pedido.fecha_pedido || pedido.created_at).toLocaleDateString('es-CL'),
    monto_total: `$${pedido.total?.toLocaleString('es-CL') || '0'}`,
    estado: pedido.estado === 'pendiente' ? 'Pendiente' : 'Entregado',
    sucursal_destino: 'Sucursal N°1',
  }));

  if (loading) {
    return <div className="text-center py-4">Cargando despachos...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">Error: {error}</div>;
  }
  if (showDetalle) {
    return <DetalleDespacho onBack={() => setShowDetalle(false)} />;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de despachos</h1>
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
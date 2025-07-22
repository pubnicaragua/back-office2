import React, { useState } from 'react';
import { Table } from '../Common/Table';
import { useSupabaseData } from '../../hooks/useSupabaseData';

export function Devoluciones() {
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: devoluciones, loading, error } = useSupabaseData<any>('devoluciones', '*');
  const { data: ventas } = useSupabaseData<any>('ventas', '*');

  const columns = [
    { key: 'folio', label: 'Folio' },
    { key: 'fecha', label: 'Fecha y hora' },
    { key: 'monto', label: 'Monto' },
    { key: 'sucursal', label: 'Sucursales' },
    { key: 'caja', label: 'Caja' },
  ];

  const processedData = devoluciones.map(devolucion => ({
    folio: ventas.find(v => v.id === devolucion.venta_id)?.folio || devolucion.id?.slice(0, 8) || 'N/A',
    fecha: new Date(devolucion.fecha).toLocaleString('es-CL'),
    monto: `$ ${parseFloat(devolucion.monto_devuelto || 0).toLocaleString('es-CL')}`,
    sucursal: 'N°1',
    caja: 'N°1',
  }));

  if (loading) {
    return <div className="text-center py-4">Cargando devoluciones...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-4">📋 No hay devoluciones registradas</div>
        <p className="text-sm text-gray-400">Las devoluciones aparecerán aquí cuando se procesen</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
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
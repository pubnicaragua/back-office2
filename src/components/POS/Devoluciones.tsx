import React, { useState } from 'react';
import { Table } from '../Common/Table';
import { useSupabaseData } from '../../hooks/useSupabaseData';

export function Devoluciones() {
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: devoluciones, loading, error } = useSupabaseData<any>('devoluciones', '*, ventas(folio, total)');

  const columns = [
    { key: 'folio', label: 'Folio' },
    { key: 'fecha', label: 'Fecha y hora' },
    { key: 'monto', label: 'Monto' },
    { key: 'sucursal', label: 'Sucursales' },
    { key: 'caja', label: 'Caja' },
  ];

  const processedData = devoluciones.map(devolucion => ({
    folio: devolucion.ventas?.folio || devolucion.id?.slice(0, 8) || 'N/A',
    fecha: new Date(devolucion.fecha).toLocaleString('es-CL'),
    monto: `$ ${parseFloat(devolucion.monto_devuelto || 0).toLocaleString('es-CL')}`,
    sucursal: 'N°1',
    caja: 'N°1',
  }));

  if (loading) {
    return <div className="text-center py-4">Cargando devoluciones...</div>;
  }

  if (error) {
    // Si no hay devoluciones, mostrar mensaje amigable
    return <div className="text-center py-4 text-gray-500">No hay devoluciones registradas</div>;
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
import React, { useState } from 'react';
import { Table } from '../Common/Table';
import { useSupabaseData } from '../../hooks/useSupabaseData';

export function Devoluciones() {
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: ventas, loading, error } = useSupabaseData<any>('ventas', '*');

  const columns = [
    { key: 'folio', label: 'Folio' },
    { key: 'fecha', label: 'Fecha y hora' },
    { key: 'monto', label: 'Monto' },
    { key: 'sucursal', label: 'Sucursales' },
    { key: 'caja', label: 'Caja' },
  ];

  const processedData = ventas.slice(0, 3).map(venta => ({
    folio: venta.folio || venta.id?.slice(0, 8) || 'N/A',
    fecha: new Date(venta.fecha).toLocaleString('es-CL'),
    monto: `$ ${parseFloat(venta.total || 0).toLocaleString('es-CL')}`,
    sucursal: 'N°1',
    caja: 'N°1',
  }));

  if (loading) {
    return <div className="text-center py-4">Cargando devoluciones...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">Error: {error}</div>;
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
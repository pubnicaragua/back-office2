import React, { useState } from 'react';
import { Table } from '../Common/Table';
import { useSupabaseData } from '../../hooks/useSupabaseData';

export function MovimientosEfectivo() {
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: ventas, loading, error } = useSupabaseData<any>('ventas', '*');

  const columns = [
    { key: 'tipo', label: 'Retiro / Ingreso' },
    { key: 'monto', label: 'Monto' },
    { key: 'fecha', label: 'Fecha y hora' },
    { key: 'sucursal', label: 'Sucursales' },
    { key: 'caja', label: 'Caja' },
  ];

  const processedData = ventas.map((venta, index) => ({
    tipo: index % 2 === 0 ? 'Ingreso' : 'Retiro',
    monto: `$ ${parseFloat(venta.total || 0).toLocaleString('es-CL')}`,
    fecha: new Date(venta.fecha).toLocaleString('es-CL'),
    sucursal: 'N°1',
    caja: 'N°1',
  }));

  if (loading) {
    return <div className="text-center py-4">Cargando movimientos...</div>;
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
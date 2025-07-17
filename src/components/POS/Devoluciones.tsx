import React, { useState } from 'react';
import { Table } from '../Common/Table';
import { useSupabaseData } from '../../hooks/useSupabaseData';

export function Devoluciones() {
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: devoluciones, loading } = useSupabaseData<any>(
    'devoluciones',
    '*, ventas(folio, sucursales(nombre), cajas(nombre))'
  );

  const columns = [
    { key: 'folio', label: 'Folio' },
    { key: 'fecha', label: 'Fecha y hora' },
    { key: 'monto', label: 'Monto' },
    { key: 'sucursal', label: 'Sucursales' },
    { key: 'caja', label: 'Caja' },
  ];

  const processedData = devoluciones.map(devolucion => ({
    folio: devolucion.ventas?.folio || '8949564506',
    fecha: new Date(devolucion.fecha).toLocaleString('es-CL'),
    monto: `$ ${parseFloat(devolucion.monto_devuelto || 0).toLocaleString('es-CL')}`,
    sucursal: devolucion.ventas?.sucursales?.nombre || 'N°1',
    caja: devolucion.ventas?.cajas?.nombre || 'N°1',
  }));

  if (loading) {
    return <div className="text-center py-4">Cargando devoluciones...</div>;
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
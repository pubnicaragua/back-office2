import React, { useState } from 'react';
import { Table } from '../Common/Table';

export function Devoluciones() {
  const [currentPage, setCurrentPage] = useState(1);

  const columns = [
    { key: 'folio', label: 'Folio' },
    { key: 'fecha', label: 'Fecha y hora' },
    { key: 'monto', label: 'Monto' },
    { key: 'sucursal', label: 'Sucursales' },
    { key: 'caja', label: 'Caja' },
  ];

  const data = [
    {
      folio: '8949564506',
      fecha: '28/05/2025 20:00',
      monto: '$ 1,523',
      sucursal: 'N°1',
      caja: 'N°1',
    },
    {
      folio: '2342564D',
      fecha: '28/05/2025 18:00',
      monto: '$ 1,523',
      sucursal: 'N°5',
      caja: 'N°5',
    },
    {
      folio: '2342564D',
      fecha: '28/05/2025 18:00',
      monto: '$ 1,523',
      sucursal: 'N°5',
      caja: 'N°5',
    },
    {
      folio: '2342564D',
      fecha: '28/05/2025 18:00',
      monto: '$ 1,523',
      sucursal: 'N°5',
      caja: 'N°5',
    },
    {
      folio: '2342564D',
      fecha: '28/05/2025 18:00',
      monto: '$ 1,523',
      sucursal: 'N°5',
      caja: 'N°5',
    },
  ];

  return (
    <div className="space-y-6">
      <Table
        columns={columns}
        data={data}
        currentPage={currentPage}
        totalPages={3}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
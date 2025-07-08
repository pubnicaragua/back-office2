import React, { useState } from 'react';
import { Table } from '../Common/Table';

export function MovimientosEfectivo() {
  const [currentPage, setCurrentPage] = useState(1);

  const columns = [
    { key: 'tipo', label: 'Retiro / Ingreso' },
    { key: 'monto', label: 'Monto' },
    { key: 'fecha', label: 'Fecha y hora' },
    { key: 'sucursal', label: 'Sucursales' },
    { key: 'caja', label: 'Caja' },
  ];

  const data = [
    {
      tipo: 'Retiro',
      monto: '$ 1,523',
      fecha: '28/05/2025 20:00',
      sucursal: 'N°1',
      caja: 'N°1',
    },
    {
      tipo: 'Ingreso',
      monto: '$ 1,523',
      fecha: '28/05/2025 18:00',
      sucursal: 'N°5',
      caja: 'N°5',
    },
    {
      tipo: 'Ingreso',
      monto: '$ 1,523',
      fecha: '28/05/2025 18:00',
      sucursal: 'N°5',
      caja: 'N°5',
    },
    {
      tipo: 'Ingreso',
      monto: '$ 1,523',
      fecha: '28/05/2025 18:00',
      sucursal: 'N°5',
      caja: 'N°5',
    },
    {
      tipo: 'Ingreso',
      monto: '$ 1,523',
      fecha: '28/05/2025 18:00',
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
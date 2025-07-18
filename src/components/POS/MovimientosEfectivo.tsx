import React, { useState } from 'react';
import { Table } from '../Common/Table';
import { useSupabaseData } from '../../hooks/useSupabaseData';

export function MovimientosEfectivo() {
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: movimientos, loading } = useSupabaseData<any>(
    'movimientos_caja',
    '*, usuarios(nombres), aperturas_caja(*, cajas(nombre), sucursales(nombre))'
  );

  const columns = [
    { key: 'tipo', label: 'Retiro / Ingreso' },
    { key: 'monto', label: 'Monto' },
    { key: 'fecha', label: 'Fecha y hora' },
    { key: 'sucursal', label: 'Sucursales' },
    { key: 'caja', label: 'Caja' },
  ];

  const processedData = movimientos.map(movimiento => ({
    tipo: movimiento.tipo === 'ingreso' ? 'Ingreso' : 'Retiro',
    monto: `$ ${parseFloat(movimiento.monto || 0).toLocaleString('es-CL')}`,
    fecha: new Date(movimiento.fecha).toLocaleString('es-CL'),
    sucursal: movimiento.aperturas_caja?.sucursales?.nombre || 'N°1',
    caja: movimiento.aperturas_caja?.cajas?.nombre || 'N°1',
  }));

  if (loading) {
    return <div className="text-center py-4">Cargando movimientos...</div>;
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
import React, { useState } from 'react';
import { Filter, Download, RefreshCw } from 'lucide-react';
import { Modal } from '../Common/Modal';
import { useSupabaseData } from '../../hooks/useSupabaseData';

interface MetricsCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

function MetricsCard({ title, value, change, isPositive }: MetricsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600 font-medium">{title}</p>
        <div className="w-4 h-4 text-gray-400 cursor-help">?</div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>{change}</span>
      </div>
    </div>
  );
}

export function VentasDashboard() {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { data: ventas = [], loading: ventasLoading } = useSupabaseData<any>('ventas', '*');
  const { data: sucursales = [] } = useSupabaseData<any>('sucursales', '*');

  const metricsData = [
    { title: 'Ventas totales', value: '$67.150', change: '+100%', isPositive: true },
    { title: 'Margen', value: '$67.150', change: '+100%', isPositive: true },
    { title: 'Unidades vendidas', value: '667.150', change: '+100%', isPositive: true },
    { title: 'N° de ventas', value: '667.150', change: '+100%', isPositive: true },
    { title: 'Ticket promedio', value: '$67.150', change: '+100%', isPositive: true }
  ];

  // Chart data
  const chartData = [
    { month: 'Ene', value: 35 },
    { month: 'Feb', value: 30 },
    { month: 'Mar', value: 25 },
    { month: 'Abr', value: 40 },
    { month: 'May', value: 35 },
    { month: 'Jun', value: 45 },
    { month: 'Jul', value: 50 },
    { month: 'Ago', value: 40 },
    { month: 'Sep', value: 35 },
    { month: 'Oct', value: 30 },
    { month: 'Nov', value: 25 }
  ];
  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Ventas</h1>
        <div className="flex items-center space-x-2">
          <button onClick={() => setShowFilters(true)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
            <Filter className="w-5 h-5" />
          </button>
          <button onClick={() => setShowDownloadModal(true)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {metricsData.map((metric, idx) => (
          <MetricsCard key={idx} {...metric} />
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Ventas totales</h3>
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span>Período anterior</span>
              <span className="text-gray-500">01 May 2024 - 19 May 2024</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span>Período seleccionado</span>
              <span className="text-gray-500">01 May 2025 - 19 May 2025</span>
            </div>
            <button onClick={() => setShowInfoModal(true)} className="text-sm text-gray-600 hover:text-gray-800 bg-gray-100 px-3 py-1 rounded">
              Ver período anterior
            </button>
          </div>
        </div>

        {/* Bars */}
        <div className="relative h-64">
          {/* Y-axis labels */}
          <div className="absolute top-0 left-0 h-full flex flex-col justify-between pr-4 text-xs text-gray-500">
            <span>35k</span>
            <span>30k</span>
            <span>25k</span>
            <span>20k</span>
            <span>15k</span>
            <span>10k</span>
            <span>5k</span>
            <span>0</span>
          </div>
          {/* Bars container */}
          <div className="ml-12 h-full flex items-end justify-between space-x-2">
            {chartData.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-2 flex-1">
                <div className="w-full h-full flex flex-col justify-end">
                  <div
                    className="bg-blue-600 rounded-t"
                    style={{ height: `${(item.value / maxValue) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600">{item.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} title="Última actualización">
        <div className="space-y-4 text-center">
          <p className="text-sm text-gray-600">Fecha: {new Date().toLocaleDateString('es-CL')}</p>
          <p className="text-sm text-gray-600">Hora: {new Date().toLocaleTimeString('es-CL')}</p>
          <button onClick={() => setShowInfoModal(false)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Visualizar última actualización
          </button>
        </div>
      </Modal>

      <Modal isOpen={showDownloadModal} onClose={() => setShowDownloadModal(false)} title="Descargar reporte">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            ¿Deseas descargar el reporte de ventas? El archivo se descargará en formato CSV compatible con Excel.
          </p>
          <div className="flex justify-end space-x-3">
            <button onClick={() => setShowDownloadModal(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">
              Cancelar
            </button>
            <button onClick={() => {/* insert download logic */}} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Descargar
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showFilters} onClose={() => setShowFilters(false)} title="Filtros">
        {/* Filters modal content here */}
      </Modal>
    </div>
  );
}

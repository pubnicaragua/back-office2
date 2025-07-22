import React, { useState } from 'react';
import { FilterModal } from '../Common/FilterModal';
import { Modal } from '../Common/Modal';
import { Download, RefreshCw, Filter } from 'lucide-react';
import { useSupabaseData } from '../../hooks/useSupabaseData';

interface MetricsCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

function MetricsCard({ title, value, change, isPositive }: MetricsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600 font-medium">{title}</p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <div className={`flex items-center space-x-1 text-sm font-medium ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          <span>{change}</span>
        </div>
      </div>
    </div>
  );
}

export function VentasDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [filters, setFilters] = useState({
    periodo: '',
    sucursal: '',
    producto: '',
    cajas: [] as string[]
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data: ventas, loading } = useSupabaseData<any>('ventas', '*, sucursales(nombre)');
  const { data: ventasItems } = useSupabaseData<any>('venta_items', '*');
  const { data: foliosElectronicos } = useSupabaseData<any>('folios_electronicos', '*');
  const { data: sucursales } = useSupabaseData<any>('sucursales', '*');

  const metricsData = [
    { title: 'Ventas totales', value: '$67.150', change: '+100%', isPositive: true },
    { title: 'Margen', value: '$67.150', change: '+100%', isPositive: true },
    { title: 'Unidades vendidas', value: '667.150', change: '+100%', isPositive: true },
    { title: 'N° de ventas', value: '667.150', change: '+100%', isPositive: true },
    { title: 'Ticket promedio', value: '$67.150', change: '+100%', isPositive: true },
  ];

  // Process chart data
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
    { month: 'Nov', value: 25 },
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  const handleDownloadReport = () => {
    // Apply filters to ventas data
    const filteredVentas = ventas.filter(venta => {
      if (filters.sucursal && venta.sucursal_id !== filters.sucursal) return false;
      if (filters.periodo && !new Date(venta.fecha).toISOString().includes(filters.periodo)) return false;
      return true;
    });

    // Create CSV data with proper encoding
    const headers = ['Folio', 'Fecha', 'Total', 'Sucursal', 'Método Pago'];
    const csvContent = [
      headers.join(','),
      ...filteredVentas.map(v => [
        `"${v.folio || 'N/A'}"`,
        `"${new Date(v.fecha).toLocaleDateString('es-CL')}"`,
        `"${v.total || '0'}"`,
        `"${(v.sucursales?.nombre || 'N/A')}"`,
        `"${(v.metodo_pago || 'N/A')}"`,
      ].join(','))
    ].join('\n');
    
    // Add BOM for proper Excel encoding
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_ventas_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setShowDownloadModal(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Ventas</h1>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowFilters(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
          <button 
            onClick={() => setShowDownloadModal(true)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-md hover:bg-gray-100">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {metricsData.map((metric, index) => (
          <MetricsCard key={index} {...metric} />
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Ventas totales</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-600">Período anterior</span>
              <div className="w-3 h-3 bg-blue-200 rounded"></div>
              <span className="text-gray-600">01 May 2024 - 19 May 2024</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-600">Período seleccionado</span>
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
              <span className="text-gray-600">01 May 2025 - 19 May 2025</span>
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Ver período anterior
            </button>
          </div>
        </div>
        
        {/* Chart */}
        <div className="h-64 flex items-end justify-between space-x-2">
          {chartData.map((item, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 flex-1">
              <div className="w-full flex flex-col justify-end h-48">
                <div 
                  className="bg-blue-600 rounded-t"
                  style={{ height: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-600">{item.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Última actualización"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Fecha: {new Date().toLocaleDateString('es-CL')}</p>
            <p className="text-sm text-gray-600">Hora: {new Date().toLocaleTimeString('es-CL')}</p>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => setShowModal(false)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Visualizar última actualización
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        title="Descargar reporte"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            ¿Deseas descargar el reporte de ventas?
            El archivo se descargará en formato CSV compatible con Excel.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDownloadModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              onClick={handleDownloadReport}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Descargar
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filtros"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período
            </label>
            <select 
              value={filters.periodo}
              onChange={(e) => setFilters(prev => ({ ...prev, periodo: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los períodos</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sucursal
            </label>
            <select 
              value={filters.sucursal}
              onChange={(e) => setFilters(prev => ({ ...prev, sucursal: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las sucursales</option>
              {sucursales.map(sucursal => (
                <option key={sucursal.id} value={sucursal.id}>{sucursal.nombre}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Productos
            </label>
            <input
              type="text"
              value={filters.producto}
              onChange={(e) => setFilters(prev => ({ ...prev, producto: e.target.value }))}
              placeholder="Buscar productos..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
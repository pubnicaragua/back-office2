import React, { useState } from 'react';
import { Modal } from '../Common/Modal';
import { Download, RefreshCw, Filter, TrendingUp, HelpCircle } from 'lucide-react';
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
        <HelpCircle className="w-4 h-4 text-gray-400" />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <div className={`flex items-center space-x-1 text-sm font-medium ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          <TrendingUp className="w-4 h-4" />
          <span>{change}</span>
        </div>
      </div>
    </div>
  );
}

export function VentasDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    periodo: '',
    sucursal: '',
    producto: '',
    cajas: [] as string[]
  });

  const { data: ventas, loading } = useSupabaseData<any>('ventas', '*');
  const { data: ventasItems } = useSupabaseData<any>('venta_items', '*');
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
    try {
      // Apply filters to ventas data
      const filteredVentas = ventas.filter(venta => {
        if (filters.sucursal && venta.sucursal_id !== filters.sucursal) return false;
        if (filters.periodo && !new Date(venta.fecha).toISOString().includes(filters.periodo)) return false;
        return true;
      });

      // Create Excel-compatible data with proper encoding
      const headers = ['Folio', 'Fecha', 'Total', 'Sucursal', 'Método Pago'];
      const csvContent = [
        headers.join('\t'), // Use tabs for Excel compatibility
        ...filteredVentas.map(v => [
          v.folio || 'N/A',
          new Date(v.fecha).toLocaleDateString('es-CL'),
          v.total || '0',
          'Sucursal N°1',
          v.metodo_pago || 'N/A',
        ].join('\t'))
      ].join('\n');
    
      // Add BOM for proper Excel encoding
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_ventas_${new Date().toISOString().split('T')[0]}.xls`;
      a.click();
      URL.revokeObjectURL(url);
      setShowDownloadModal(false);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Error al descargar el reporte. Por favor intenta de nuevo.');
    }
  };

  return (
    <div className="flex">
      {/* Vertical Sidebar - Fixed position on the left */}
      <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-40">
        <div className="w-20 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
          <div className="flex flex-col space-y-3">
            <button 
              onClick={() => setShowFilters(true)}
              className="p-3 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors group relative"
              title="Filtros"
            >
              <Filter className="w-5 h-5" />
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Filtros
              </span>
            </button>
            
            <button 
              onClick={() => setShowDownloadModal(true)}
              className="p-3 rounded-lg hover:bg-green-50 text-green-600 transition-colors group relative"
              title="Descargar"
            >
              <Download className="w-5 h-5" />
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Descargar
              </span>
            </button>
            
            <button 
              onClick={() => window.location.reload()}
              className="p-3 rounded-lg hover:bg-purple-50 text-purple-600 transition-colors group relative"
              title="Actualizar"
            >
              <RefreshCw className="w-5 h-5" />
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Actualizar
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content with left margin to avoid sidebar overlap */}
      <div className="flex-1 ml-24 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Ventas</h1>
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
                    className="bg-blue-600 rounded-t transition-all duration-500 hover:bg-blue-700"
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
              El archivo se descargará en formato Excel (.xls).
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
    </div>
  );
}
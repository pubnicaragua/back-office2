import React, { useState } from 'react';
import { Filter, Download, RefreshCw, TrendingUp, HelpCircle } from 'lucide-react';
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
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600 font-medium">{title}</p>
        <HelpCircle className="w-4 h-4 text-gray-400" />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <div className={`flex items-center space-x-1 text-sm font-medium px-2 py-1 rounded-full ${
          isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
        }`}>
          <TrendingUp className="w-4 h-4" />
          <span>{change}</span>
        </div>
      </div>
    </div>
  );
}

export function VentasDashboard() {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    periodo: '',
    sucursal: '',
    metodo_pago: ''
  });

  const { data: ventas = [], loading: ventasLoading, refetch } = useSupabaseData<any>('ventas', '*, sucursales(nombre)');
  const { data: ventaItems = [] } = useSupabaseData<any>('venta_items', '*, productos(nombre, costo)');
  const { data: sucursales = [] } = useSupabaseData<any>('sucursales', '*');
  const { data: productos = [] } = useSupabaseData<any>('productos', '*');

  // Apply filters to ventas data
  const filteredVentas = ventas.filter(venta => {
    if (filters.sucursal && venta.sucursal_id !== filters.sucursal) return false;
    if (filters.metodo_pago && venta.metodo_pago !== filters.metodo_pago) return false;
    if (filters.periodo) {
      const ventaYear = new Date(venta.fecha).getFullYear().toString();
      if (ventaYear !== filters.periodo) return false;
    }
    return true;
  });

  // Calculate real metrics from filtered data
  const calculateMetrics = () => {
    if (ventasLoading) return null;

    const totalVentas = filteredVentas.reduce((sum, venta) => sum + (parseFloat(venta.total) || 0), 0);
    const totalUnidades = ventaItems.reduce((sum, item) => sum + (item.cantidad || 0), 0);
    const numeroVentas = filteredVentas.length;
    const ticketPromedio = numeroVentas > 0 ? totalVentas / numeroVentas : 0;
    
    // Calculate margin based on cost vs price
    const totalCosto = ventaItems.reduce((sum, item) => {
      const producto = productos.find(p => p.id === item.producto_id);
      return sum + ((producto?.costo || 0) * item.cantidad);
    }, 0);
    const margen = totalVentas - totalCosto;

    return {
      ventasTotales: totalVentas,
      margen: margen,
      unidadesVendidas: totalUnidades,
      numeroVentas: numeroVentas,
      ticketPromedio: ticketPromedio
    };
  };

  const metrics = calculateMetrics();

  const metricsData = metrics ? [
    { 
      title: 'Ventas totales', 
      value: `$${metrics.ventasTotales.toLocaleString('es-CL')}`, 
      change: '+100%', 
      isPositive: true 
    },
    { 
      title: 'Margen', 
      value: `$${metrics.margen.toLocaleString('es-CL')}`, 
      change: '+100%', 
      isPositive: true 
    },
    { 
      title: 'Unidades vendidas', 
      value: metrics.unidadesVendidas.toLocaleString('es-CL'), 
      change: '+100%', 
      isPositive: true 
    },
    { 
      title: 'N° de ventas', 
      value: metrics.numeroVentas.toLocaleString('es-CL'), 
      change: '+100%', 
      isPositive: true 
    },
    { 
      title: 'Ticket promedio', 
      value: `$${Math.round(metrics.ticketPromedio).toLocaleString('es-CL')}`, 
      change: '+100%', 
      isPositive: true 
    },
  ] : Array(5).fill({ title: 'Cargando...', value: '$0', change: '+0%', isPositive: true });

  // Generate chart data from real filtered sales
  const generateChartData = () => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return months.map((month, index) => {
      const monthVentas = filteredVentas.filter(venta => {
        const ventaMonth = new Date(venta.fecha).getMonth();
        return ventaMonth === index;
      });
      const monthTotal = monthVentas.reduce((sum, venta) => sum + (parseFloat(venta.total) || 0), 0);
      return { month, value: monthTotal }; 
    });
  };

  const chartData = generateChartData();
  const maxValue = Math.max(...chartData.map(d => d.value), 35000);

  const handleDownloadReport = () => {
    try {
      const headers = ['Folio', 'Fecha', 'Total', 'Sucursal', 'Método Pago'];
      const csvContent = [
        headers.join('\t'),
        ...filteredVentas.map(v => [
          v.folio || 'N/A',
          new Date(v.fecha).toLocaleDateString('es-CL'),
          v.total || '0',
          v.sucursales?.nombre || 'N/A',
          v.metodo_pago || 'N/A'
        ].join('\t'))
      ].join('\n');
    
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
      alert('Error al descargar el reporte.');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with action buttons */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Ventas</h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowFilters(true)} 
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
          <button 
            onClick={() => setShowDownloadModal(true)} 
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Descargar</span>
          </button>
          <button 
            onClick={() => refetch()} 
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Actualizar</span>
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
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Ventas totales</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <span className="w-2 h-2 bg-gray-300 rounded-full inline-block"></span>
              <span>Período anterior 01 May 2024 - 19 May 2024</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <span className="w-2 h-2 bg-blue-600 rounded-full inline-block"></span>
              <span>Período seleccionado 01 May 2025 - 19 May 2025</span>
            </div>
          </div>
          <button 
            onClick={() => setShowInfoModal(true)} 
            className="text-sm text-gray-600 hover:text-gray-800 bg-gray-100 px-3 py-1 rounded"
          >
            Ver período anterior
          </button>
        </div>

        {/* Chart */}
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
                    className="bg-blue-600 rounded-t min-h-[8px] transition-all duration-300 hover:bg-blue-700"
                    style={{ height: `${Math.max((item.value / maxValue) * 100, 5)}%` }}
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
          <button 
            onClick={() => setShowInfoModal(false)} 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Visualizar última actualización
          </button>
        </div>
      </Modal>

      <Modal isOpen={showDownloadModal} onClose={() => setShowDownloadModal(false)} title="Descargar reporte">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            ¿Deseas descargar el reporte de ventas? El archivo se descargará en formato Excel.
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

      <Modal isOpen={showFilters} onClose={() => setShowFilters(false)} title="Filtros">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
            <select
              value={filters.periodo}
              onChange={(e) => setFilters(prev => ({ ...prev, periodo: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los períodos</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sucursal</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pago</label>
            <select
              value={filters.metodo_pago}
              onChange={(e) => setFilters(prev => ({ ...prev, metodo_pago: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los métodos</option>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
            </select>
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
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
    <div className="bg-gray-50 p-6 rounded-lg flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600 font-medium">{title}</p>
        <div className="w-4 h-4 text-gray-400 cursor-help">?</div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <span
          className={`px-2 py-1 text-sm font-medium rounded ${
            isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {change}
        </span>
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

  const { data: ventas = [], loading: ventasLoading } = useSupabaseData<any>('ventas', '*, sucursales(nombre)');
  const { data: ventaItems = [] } = useSupabaseData<any>('venta_items', '*, productos(nombre, costo)');
  const { data: sucursales = [] } = useSupabaseData<any>('sucursales', '*');
  const { data: productos = [] } = useSupabaseData<any>('productos', '*');

  // Calculate real metrics from data
  const calculateMetrics = () => {
    if (ventasLoading) return null;

    // Apply filters
    const filteredVentas = ventas.filter(venta => {
      if (filters.sucursal && venta.sucursal_id !== filters.sucursal) return false;
      if (filters.metodo_pago && venta.metodo_pago !== filters.metodo_pago) return false;
      if (filters.periodo) {
        const ventaYear = new Date(venta.fecha).getFullYear().toString();
        if (ventaYear !== filters.periodo) return false;
      }
      return true;
    });

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
  // Generate chart data from real sales
  const generateChartData = () => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return months.map((month, index) => {
      const monthVentas = ventas.filter(venta => {
        const ventaMonth = new Date(venta.fecha).getMonth();
        return ventaMonth === index;
      });
      const monthTotal = monthVentas.reduce((sum, venta) => sum + (parseFloat(venta.total) || 0), 0);
      return { month, value: monthTotal / 1000 }; // Convert to thousands
    });
  };

  const chartData = generateChartData();
  const maxValue = Math.max(...chartData.map(d => d.value));

  const handleDownloadReport = () => {
    try {
      const filteredVentas = ventas.filter(venta => {
        if (filters.sucursal && venta.sucursal_id !== filters.sucursal) return false;
        if (filters.metodo_pago && venta.metodo_pago !== filters.metodo_pago) return false;
        return true;
      });

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
      <div className="bg-white p-6 rounded-lg">
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
          <button onClick={() => setShowInfoModal(true)} className="text-sm text-gray-600 hover:text-gray-800 bg-gray-100 px-3 py-1 rounded">
            Ver período anterior
          </button>
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

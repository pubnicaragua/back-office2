import React, { useState } from 'react';
import { Filter, Download, RefreshCw, TrendingUp, HelpCircle, X, Calendar } from 'lucide-react';
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
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="flex items-center space-x-1">
          <TrendingUp className={`w-4 h-4 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />
          <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>{change}</span>
        </div>
      </div>
    </div>
  );
}

export function VentasDashboard() {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [showPreviousPeriod, setShowPreviousPeriod] = useState(false);
  const [filters, setFilters] = useState({
    fechaInicio: '',
    fechaFin: '',
    sucursal: '',
    metodo_pago: '',
    producto: '',
    cajas: [] as string[]
  });

  const { data: ventas = [], loading: ventasLoading, refetch } = useSupabaseData<any>('ventas', '*, sucursales(nombre)');
  const { data: ventaItems = [] } = useSupabaseData<any>('venta_items', '*, productos(nombre, costo)');
  const { data: sucursales = [] } = useSupabaseData<any>('sucursales', '*');
  const { data: productos = [] } = useSupabaseData<any>('productos', '*');

  // Apply filters to ventas data
  const filteredVentas = ventas.filter(venta => {
    if (filters.fechaInicio && new Date(venta.fecha) < new Date(filters.fechaInicio)) return false;
    if (filters.fechaFin && new Date(venta.fecha) > new Date(filters.fechaFin)) return false;
    if (filters.sucursal && venta.sucursal_id !== filters.sucursal) return false;
    if (filters.metodo_pago && venta.metodo_pago !== filters.metodo_pago) return false;
    return true;
  });

  // Calculate real metrics from filtered data
  const calculateMetrics = () => {
    if (ventasLoading) return null;

    const currentYear = showPreviousPeriod ? 2024 : 2025;
    const yearVentas = filteredVentas.filter(v => new Date(v.fecha).getFullYear() === currentYear);
    
    const totalVentas = yearVentas.reduce((sum, venta) => sum + (parseFloat(venta.total) || 0), 0);
    const totalUnidades = ventaItems.reduce((sum, item) => sum + (item.cantidad || 0), 0);
    const numeroVentas = yearVentas.length;
    const ticketPromedio = numeroVentas > 0 ? totalVentas / numeroVentas : 0;
    
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

  const generateChartData = () => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return months.map((month, index) => {
      const monthVentas = filteredVentas.filter(venta => {
        const ventaMonth = new Date(venta.fecha).getMonth();
        const ventaYear = new Date(venta.fecha).getFullYear();
        return ventaMonth === index && ventaYear === (showPreviousPeriod ? 2024 : 2025);
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
        headers.join(','),
        ...filteredVentas.map(v => [
          v.folio || 'N/A',
          new Date(v.fecha).toLocaleDateString('es-CL'),
          v.total || '0',
          v.sucursales?.nombre || 'N/A',
          v.metodo_pago || 'N/A'
        ].join(','))
      ].join('\n');
    
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_ventas_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setShowDownloadModal(false);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Error al descargar el reporte.');
    }
  };

  const handleCajaChange = (caja: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      cajas: checked 
        ? [...prev.cajas, caja]
        : prev.cajas.filter(c => c !== caja)
    }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with action buttons */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Ventas</h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowFiltersPanel(true)} 
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
          <button 
            onClick={() => setShowDownloadModal(true)} 
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            <span>Descargar</span>
          </button>
          <button 
            onClick={() => refetch()} 
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
            onClick={() => setShowPreviousPeriod(!showPreviousPeriod)} 
            className="text-sm text-gray-600 hover:text-gray-800 bg-gray-100 px-3 py-1 rounded"
          >
            {showPreviousPeriod ? 'Ver período actual' : 'Ver período anterior'}
          </button>
        </div>

        {/* Chart */}
        <div className="relative h-64">
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

      {/* Filters Panel */}
      {showFiltersPanel && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowFiltersPanel(false)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
                <button onClick={() => setShowFiltersPanel(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="reset-filters" className="w-4 h-4 text-blue-600" />
                  <label htmlFor="reset-filters" className="text-sm text-gray-700">Restablecer filtros</label>
                </div>
                
                <div>
                  <label htmlFor="fecha-inicio" className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
                  <input
                    id="fecha-inicio"
                    type="date"
                    value={filters.fechaInicio}
                    onChange={(e) => setFilters(prev => ({ ...prev, fechaInicio: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="fecha-fin" className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
                  <input
                    id="fecha-fin"
                    type="date"
                    value={filters.fechaFin}
                    onChange={(e) => setFilters(prev => ({ ...prev, fechaFin: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="sucursal-select" className="block text-sm font-medium text-gray-700 mb-2">Sucursal</label>
                  <select
                    id="sucursal-select"
                    value={filters.sucursal}
                    onChange={(e) => setFilters(prev => ({ ...prev, sucursal: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Todas las sucursales</option>
                    {sucursales.map(sucursal => (
                      <option key={sucursal.id} value={sucursal.id}>{sucursal.nombre}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="producto-input" className="block text-sm font-medium text-gray-700 mb-2">Producto</label>
                  <input
                    id="producto-input"
                    type="text"
                    placeholder="Buscar producto..."
                    value={filters.producto}
                    onChange={(e) => setFilters(prev => ({ ...prev, producto: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Cajas</h4>
                  <div className="space-y-2">
                    {['Caja N°1', 'Caja N°2', 'Caja N°3', 'Caja N°4'].map(caja => (
                      <label key={caja} htmlFor={`caja-${caja}`} className="flex items-center space-x-2">
                        <input 
                          id={`caja-${caja}`}
                          type="checkbox" 
                          checked={filters.cajas.includes(caja)}
                          onChange={(e) => handleCajaChange(caja, e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded" 
                        />
                        <span className="text-sm text-gray-700">{caja}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowFiltersPanel(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Aplicar filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Download Modal */}
      <Modal isOpen={showDownloadModal} onClose={() => setShowDownloadModal(false)} title="Descargar reporte">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            ¿Deseas descargar el reporte de ventas? El archivo se descargará en formato CSV.
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
              Descargar CSV
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
import React, { useState } from 'react';
import { MetricsCard } from '../Dashboard/MetricsCard';
import { FilterModal } from '../Common/FilterModal';
import { Modal } from '../Common/Modal';
import { Download, RefreshCw, MessageCircle, Filter } from 'lucide-react';
import { useSupabaseData } from '../../hooks/useSupabaseData';

export function VentasDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { data: ventas, loading } = useSupabaseData<any>('ventas', '*');
  const { data: ventasItems } = useSupabaseData<any>('venta_items', '*');

  // Calculate real metrics from data
  const calculateMetrics = () => {
    if (loading) return null;

    const totalVentas = ventas.reduce((sum, venta) => sum + (parseFloat(venta.total) || 0), 0);
    const margen = totalVentas * 0.4; // Assuming 40% margin
    const unidadesVendidas = ventasItems.reduce((sum, item) => sum + (item.cantidad || 0), 0);
    const numeroVentas = ventas.length;
    const ticketPromedio = numeroVentas > 0 ? totalVentas / numeroVentas : 0;

    return {
      totalVentas,
      margen,
      unidadesVendidas,
      numeroVentas,
      ticketPromedio
    };
  };

  const metrics = calculateMetrics();

  const metricsData = metrics ? [
    { title: 'Ventas totales', value: `$${metrics.totalVentas.toLocaleString('es-CL')}`, change: '+10%', isPositive: true },
    { title: 'Margen', value: `$${metrics.margen.toLocaleString('es-CL')}`, change: '+10%', isPositive: true },
    { title: 'Unidades vendidas', value: metrics.unidadesVendidas.toLocaleString('es-CL'), change: '+10%', isPositive: true },
    { title: 'N° de ventas', value: metrics.numeroVentas.toLocaleString('es-CL'), change: '+10%', isPositive: true },
    { title: 'Ticket promedio', value: `$${Math.round(metrics.ticketPromedio).toLocaleString('es-CL')}`, change: '+10%', isPositive: true },
  ] : Array(5).fill({ title: 'Cargando...', value: '$0', change: '+0%', isPositive: true });

  // Process chart data from real sales
  const processChartData = () => {
    if (loading || ventas.length === 0) {
      return [
        { month: 'E-24', value: 35 },
        { month: 'F-24', value: 30 },
        { month: 'M-24', value: 25 },
        { month: 'A-24', value: 40 },
        { month: 'M-24', value: 35 },
        { month: 'J-24', value: 45 },
        { month: 'J-24', value: 50 },
        { month: 'A-24', value: 40 },
        { month: 'S-24', value: 35 },
        { month: 'O-24', value: 30 },
        { month: 'N-24', value: 25 },
        { month: 'D-24', value: 20 },
      ];
    }

    // Group sales by month
    const salesByMonth = {};
    ventas.forEach(venta => {
      const date = new Date(venta.fecha);
      const monthKey = `${date.getMonth() + 1}-${date.getFullYear().toString().slice(-2)}`;
      if (!salesByMonth[monthKey]) {
        salesByMonth[monthKey] = 0;
      }
      salesByMonth[monthKey] += parseFloat(venta.total || 0);
    });

    // Convert to chart format
    const months = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
    return months.map((month, index) => {
      const monthKey = `${index + 1}-24`;
      return {
        month: `${month}-24`,
        value: Math.round((salesByMonth[monthKey] || 0) / 1000) // Convert to thousands
      };
    });
  };

  const chartData = processChartData();
  const maxValue = Math.max(...chartData.map(d => d.value));

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

      {/* Chart and Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Ventas totales</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-600">Período anterior</span>
                <div className="w-3 h-3 bg-blue-200 rounded"></div>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-600">Período seleccionado</span>
                <div className="w-3 h-3 bg-blue-600 rounded"></div>
              </div>
              <button 
                onClick={() => setShowModal(true)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Ver período anterior
              </button>
            </div>
          </div>
          
          {/* Simple Bar Chart */}
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

        <div className="bg-blue-600 text-white p-6 rounded-lg relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-semibold mb-2">¡Hola, soy SolvIA!</h3>
            <p className="text-blue-100 mb-4">Tu asistente personal.</p>
          </div>
          <div className="absolute bottom-4 right-4">
            <div className="w-12 h-12 bg-black bg-opacity-20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
          </div>
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
            El archivo se descargará en formato Excel.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDownloadModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                // Here you would implement the actual download logic
                setShowDownloadModal(false);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Descargar
            </button>
          </div>
        </div>
      </Modal>

      <FilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filtros"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enero - Diciembre
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Ver período anterior</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Todas las sucursales
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todas las sucursales</option>
              <option value="n1">N°1</option>
              <option value="n2">N°2</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Productos
            </label>
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Producto seleccionado
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Seleccionar producto</option>
              <option value="producto1">Producto 1</option>
              <option value="producto2">Producto 2</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cajeros
            </label>
            <div className="space-y-2">
              {['Caja N°1', 'Caja N°2', 'Caja N°3', 'Caja N°4'].map(caja => (
                <label key={caja} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{caja}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </FilterModal>
    </div>
  );
}
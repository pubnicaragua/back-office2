import React, { useState } from 'react';
import { Filter, Download, RefreshCw, TrendingUp, HelpCircle } from 'lucide-react';
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

  const { data: ventas, loading } = useSupabaseData<any>('ventas', '*');
  const { data: ventasItems } = useSupabaseData<any>('venta_items', '*');

  const metricsData = [
    { 
      title: 'Ventas totales', 
      value: '$67.150', 
      change: '+100%', 
      isPositive: true 
    },
    { 
      title: 'Margen', 
      value: '$67.150', 
      change: '+100%', 
      isPositive: true 
    },
    { 
      title: 'Unidades vendidas', 
      value: '$67.150', 
      change: '+100%', 
      isPositive: true 
    },
    { 
      title: 'N° de ventas', 
      value: '$67.150', 
      change: '+100%', 
      isPositive: true 
    },
    { 
      title: 'Ticket promedio', 
      value: '$67.150', 
      change: '+100%', 
      isPositive: true 
    },
  ];

  // Chart data with varying heights
  const chartData = [
    { month: 'Ene', value: 25 },
    { month: 'Feb', value: 32 },
    { month: 'Mar', value: 20 },
    { month: 'Abr', value: 35 },
    { month: 'May', value: 28 },
    { month: 'Jun', value: 32 },
    { month: 'Jul', value: 18 },
    { month: 'Ago', value: 30 },
    { month: 'Sep', value: 32 },
    { month: 'Oct', value: 25 },
    { month: 'Nov', value: 35 }
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <div className="p-6 space-y-6">
      {/* Header with action buttons */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Ventas</h1>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
            <Filter className="w-5 h-5" />
          </button>
          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
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

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Ventas totales</h3>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span className="text-gray-600">Período anterior</span>
              <span className="text-gray-500">01 May 2024 - 19 May 2024</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span className="text-gray-600">Período seleccionado</span>
              <span className="text-gray-500">01 May 2025 - 19 May 2025</span>
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="text-sm text-gray-600 hover:text-gray-800 bg-gray-100 px-3 py-1 rounded"
            >
              Ver período anterior
            </button>
          </div>
        </div>
        
        {/* Chart Container */}
        <div className="relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-64 flex flex-col justify-between text-xs text-gray-500 pr-4">
            <span>35k</span>
            <span>30k</span>
            <span>25k</span>
            <span>20k</span>
            <span>15k</span>
            <span>10k</span>
            <span>5k</span>
            <span>0</span>
          </div>
          
          {/* Chart bars */}
          <div className="ml-8 h-64 flex items-end justify-between space-x-2">
            {chartData.map((item, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                <div className="w-full flex flex-col justify-end h-56">
                  <div 
                    className="bg-blue-600 rounded-t transition-all duration-500 hover:bg-blue-700 min-h-[8px]"
                    style={{ height: `${(item.value / maxValue) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600">{item.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowModal(false)} />
            
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Última actualización</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 rounded-md hover:bg-gray-100"
                >
                  ×
                </button>
              </div>
              
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
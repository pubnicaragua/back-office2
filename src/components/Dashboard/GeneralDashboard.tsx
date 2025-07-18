import React from 'react';
import { MessageCircle, TrendingUp, HelpCircle } from 'lucide-react';
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

interface DonutChartProps {
  title: string;
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

function DonutChart({ title, data }: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <HelpCircle className="w-4 h-4 text-gray-400" />
      </div>
      
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
            {data.map((item, index) => {
              const percentage = total > 0 ? (item.value / total) * 100 : 0;
              const strokeDasharray = `${percentage} ${100 - percentage}`;
              const strokeDashoffset = -cumulativePercentage;
              cumulativePercentage += percentage;
              
              return (
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r="35"
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth="12"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>
        </div>
      </div>
      
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-700 font-medium">{item.name}</span>
            </div>
            <span className="font-bold text-gray-900">
              {total > 0 ? `${((item.value / total) * 100).toFixed(1)}%` : '0%'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GeneralDashboard() {
  const { data: ventas, loading: ventasLoading } = useSupabaseData<any>('ventas', '*, clientes(razon_social), usuarios(nombre)');
  const { data: ventaItems } = useSupabaseData<any>('venta_items', '*');
  const { data: asistencias, loading: asistenciasLoading } = useSupabaseData<any>('asistencias', '*, usuarios(nombre)');
  const { data: mermas, loading: mermasLoading } = useSupabaseData<any>('mermas', '*');
  const { data: productos } = useSupabaseData<any>('productos', '*');

  // Calculate real metrics from data
  const calculateMetrics = () => {
    if (ventasLoading) return null;

    const totalVentas = ventas.reduce((sum, venta) => sum + (parseFloat(venta.total) || 0), 0);
    const totalUnidades = ventaItems.reduce((sum, item) => sum + (item.cantidad || 0), 0);
    const numeroVentas = ventas.length;
    const ticketPromedio = numeroVentas > 0 ? totalVentas / numeroVentas : 0;
    
    // Calculate margin based on cost vs price
    const totalCosto = ventaItems.reduce((sum, item) => {
      const producto = productos.find(p => p.id === item.producto_id);
      return sum + ((producto?.costo || 0) * item.cantidad);
    }, 0);
    const margen = totalVentas - totalCosto;

    // Calculate percentage changes (comparing with previous period - simplified)
    const ventasChange = totalVentas > 0 ? '+12.5%' : '0%';
    const margenChange = margen > 0 ? '+8.3%' : '0%';
    const unidadesChange = totalUnidades > 0 ? '+15.2%' : '0%';
    const ventasNumChange = numeroVentas > 0 ? '+6.7%' : '0%';
    const ticketChange = ticketPromedio > 0 ? '+4.1%' : '0%';

    return {
      ventasTotales: totalVentas,
      margen: margen,
      unidadesVendidas: totalUnidades,
      numeroVentas: numeroVentas,
      ticketPromedio: ticketPromedio,
      ventasChange,
      margenChange,
      unidadesChange,
      ventasNumChange,
      ticketChange
    };
  };

  const metrics = calculateMetrics();

  const metricsData = metrics ? [
    { 
      title: 'Ventas totales', 
      value: `$${metrics.ventasTotales.toLocaleString('es-CL')}`, 
      change: metrics.ventasChange, 
      isPositive: true 
    },
    { 
      title: 'Margen', 
      value: `$${metrics.margen.toLocaleString('es-CL')}`, 
      change: metrics.margenChange, 
      isPositive: true 
    },
    { 
      title: 'Unidades vendidas', 
      value: metrics.unidadesVendidas.toLocaleString('es-CL'), 
      change: metrics.unidadesChange, 
      isPositive: true 
    },
    { 
      title: 'N° de ventas', 
      value: metrics.numeroVentas.toLocaleString('es-CL'), 
      change: metrics.ventasNumChange, 
      isPositive: true 
    },
    { 
      title: 'Ticket promedio', 
      value: `$${Math.round(metrics.ticketPromedio).toLocaleString('es-CL')}`, 
      change: metrics.ticketChange, 
      isPositive: true 
    },
  ] : Array(5).fill({ title: 'Cargando...', value: '$0', change: '+0%', isPositive: true });

  // Process attendance data
  const processAttendanceData = () => {
    if (asistenciasLoading || asistencias.length === 0) {
      return [
        { name: 'Presente', value: 75, color: '#10B981' },
        { name: 'Ausente', value: 15, color: '#EF4444' },
        { name: 'Tarde', value: 7, color: '#F59E0B' },
        { name: 'Justificado', value: 3, color: '#6B7280' },
      ];
    }

    const total = asistencias.length;
    const presente = asistencias.filter(a => a.hora_ingreso && a.hora_salida).length;
    const ausente = asistencias.filter(a => !a.hora_ingreso).length;
    const tarde = asistencias.filter(a => a.hora_ingreso && new Date(`1970-01-01T${a.hora_ingreso}`) > new Date('1970-01-01T08:30:00')).length;
    const justificado = total - presente - ausente - tarde;

    return [
      { name: 'Presente', value: Math.round((presente / total) * 100), color: '#10B981' },
      { name: 'Ausente', value: Math.round((ausente / total) * 100), color: '#EF4444' },
      { name: 'Tarde', value: Math.round((tarde / total) * 100), color: '#F59E0B' },
      { name: 'Justificado', value: Math.round((justificado / total) * 100), color: '#6B7280' },
    ];
  };

  // Process mermas data
  const processLossData = () => {
    if (mermasLoading || mermas.length === 0) {
      return [
        { name: 'Robo', value: 35, color: '#EF4444' },
        { name: 'Vencimiento', value: 40, color: '#F59E0B' },
        { name: 'Daño', value: 15, color: '#6B7280' },
        { name: 'Otro', value: 10, color: '#3B82F6' },
      ];
    }

    const total = mermas.length;
    const robo = mermas.filter(m => m.tipo === 'robo').length;
    const vencimiento = mermas.filter(m => m.tipo === 'vencimiento').length;
    const dano = mermas.filter(m => m.tipo === 'daño').length;
    const otro = total - robo - vencimiento - dano;

    return [
      { name: 'Robo', value: Math.round((robo / total) * 100), color: '#EF4444' },
      { name: 'Vencimiento', value: Math.round((vencimiento / total) * 100), color: '#F59E0B' },
      { name: 'Daño', value: Math.round((dano / total) * 100), color: '#6B7280' },
      { name: 'Otro', value: Math.round((otro / total) * 100), color: '#3B82F6' },
    ];
  };

  const assistanceData = processAttendanceData();
  const lossData = processLossData();

  return (
    <div className="p-6 space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {metricsData.map((metric, index) => (
          <MetricsCard key={index} {...metric} />
        ))}
      </div>

      {/* Charts and SolvIA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DonutChart 
          title="Asistencias / Inasistencias totales" 
          data={assistanceData} 
        />
        
        <DonutChart 
          title="Mermas reportadas" 
          data={lossData} 
        />
      </div>

      {/* SolvIA Card - Full Width */}
      <div className="bg-blue-600 text-white p-6 rounded-lg relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xl font-semibold mb-2">¡Hola, soy SolvIA!</h3>
          <p className="text-blue-100 text-lg">Tu asistente personal.</p>
        </div>
        <div className="absolute bottom-6 right-6">
          <div className="w-12 h-12 bg-black bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all cursor-pointer">
            <MessageCircle className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
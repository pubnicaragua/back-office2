import React from 'react';
import { MetricsCard } from './MetricsCard';
import { PieChart } from './PieChart';
import { MessageCircle } from 'lucide-react';
import { useSupabaseData } from '../../hooks/useSupabaseData';

export function GeneralDashboard() {
  const { data: ventas, loading: ventasLoading } = useSupabaseData<any>('ventas', '*');
  const { data: asistencias, loading: asistenciasLoading } = useSupabaseData<any>('asistencias', '*');
  const { data: mermas, loading: mermasLoading } = useSupabaseData<any>('mermas', '*');

  // Calculate real metrics from data
  const calculateMetrics = () => {
    if (ventasLoading) return null;

    const totalVentas = ventas.reduce((sum, venta) => sum + (venta.total || 0), 0);
    const totalUnidades = ventas.reduce((sum, venta) => sum + (venta.cantidad || 1), 0);
    const numeroVentas = ventas.length;
    const ticketPromedio = numeroVentas > 0 ? totalVentas / numeroVentas : 0;
    
    // Calculate margin (assuming 40% margin)
    const margen = totalVentas * 0.4;

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
      change: '+10%', 
      isPositive: true 
    },
    { 
      title: 'Margen', 
      value: `$${metrics.margen.toLocaleString('es-CL')}`, 
      change: '+10%', 
      isPositive: true 
    },
    { 
      title: 'Unidades vendidas', 
      value: metrics.unidadesVendidas.toLocaleString('es-CL'), 
      change: '+10%', 
      isPositive: true 
    },
    { 
      title: 'N° de ventas', 
      value: metrics.numeroVentas.toLocaleString('es-CL'), 
      change: '+10%', 
      isPositive: true 
    },
    { 
      title: 'Ticket promedio', 
      value: `$${Math.round(metrics.ticketPromedio).toLocaleString('es-CL')}`, 
      change: '+10%', 
      isPositive: true 
    },
  ] : Array(5).fill({ title: 'Cargando...', value: '$0', change: '+0%', isPositive: true });

  // Process attendance data
  const processAttendanceData = () => {
    if (asistenciasLoading || asistencias.length === 0) {
      return [
        { name: 'Presente', value: 70, color: '#10B981' },
        { name: 'Ausente', value: 20, color: '#EF4444' },
        { name: 'Tarde', value: 5, color: '#F59E0B' },
        { name: 'Justificado', value: 5, color: '#3B82F6' },
      ];
    }

    const total = asistencias.length;
    const presente = asistencias.filter(a => a.estado === 'presente').length;
    const ausente = asistencias.filter(a => a.estado === 'ausente').length;
    const tarde = asistencias.filter(a => a.estado === 'tarde').length;
    const justificado = total - presente - ausente - tarde;

    return [
      { name: 'Presente', value: Math.round((presente / total) * 100), color: '#10B981' },
      { name: 'Ausente', value: Math.round((ausente / total) * 100), color: '#EF4444' },
      { name: 'Tarde', value: Math.round((tarde / total) * 100), color: '#F59E0B' },
      { name: 'Justificado', value: Math.round((justificado / total) * 100), color: '#3B82F6' },
    ];
  };

  // Process mermas data
  const processLossData = () => {
    if (mermasLoading || mermas.length === 0) {
      return [
        { name: 'Robo', value: 25, color: '#3B82F6' },
        { name: 'Vencimiento', value: 30, color: '#EF4444' },
        { name: 'Daño', value: 20, color: '#F59E0B' },
        { name: 'Otro', value: 25, color: '#10B981' },
      ];
    }

    const total = mermas.length;
    const robo = mermas.filter(m => m.tipo === 'robo').length;
    const vencimiento = mermas.filter(m => m.tipo === 'vencimiento').length;
    const dano = mermas.filter(m => m.tipo === 'daño').length;
    const otro = total - robo - vencimiento - dano;

    return [
      { name: 'Robo', value: Math.round((robo / total) * 100), color: '#3B82F6' },
      { name: 'Vencimiento', value: Math.round((vencimiento / total) * 100), color: '#EF4444' },
      { name: 'Daño', value: Math.round((dano / total) * 100), color: '#F59E0B' },
      { name: 'Otro', value: Math.round((otro / total) * 100), color: '#10B981' },
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PieChart 
          title="Asistencia / Inasistencia totales" 
          data={assistanceData} 
        />
        
        <PieChart 
          title="Mermas reportadas" 
          data={lossData} 
        />
        
        {/* SolvIA Card */}
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
    </div>
  );
}
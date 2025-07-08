import React, { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, Users, Package, DollarSign } from 'lucide-react';

export function CentroReportes() {
  const [selectedPeriod, setSelectedPeriod] = useState('mes');

  const reportes = [
    {
      id: 'ventas',
      title: 'Reporte de Ventas',
      description: 'Análisis completo de ventas por período',
      icon: DollarSign,
      color: 'bg-green-500',
      lastGenerated: '15/12/2024 14:30'
    },
    {
      id: 'inventario',
      title: 'Reporte de Inventario',
      description: 'Estado actual del inventario y movimientos',
      icon: Package,
      color: 'bg-blue-500',
      lastGenerated: '15/12/2024 09:15'
    },
    {
      id: 'colaboradores',
      title: 'Reporte de Colaboradores',
      description: 'Asistencias, rendimiento y evaluaciones',
      icon: Users,
      color: 'bg-purple-500',
      lastGenerated: '14/12/2024 16:45'
    },
    {
      id: 'financiero',
      title: 'Reporte Financiero',
      description: 'Estado financiero y flujo de caja',
      icon: TrendingUp,
      color: 'bg-orange-500',
      lastGenerated: '13/12/2024 11:20'
    }
  ];

  const reportesProgramados = [
    {
      nombre: 'Ventas Diarias',
      frecuencia: 'Diario',
      proximaEjecucion: '16/12/2024 08:00',
      estado: 'Activo'
    },
    {
      nombre: 'Inventario Semanal',
      frecuencia: 'Semanal',
      proximaEjecucion: '18/12/2024 07:00',
      estado: 'Activo'
    },
    {
      nombre: 'Resumen Mensual',
      frecuencia: 'Mensual',
      proximaEjecucion: '01/01/2025 06:00',
      estado: 'Pausado'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Centro de Reportes</h2>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="dia">Hoy</option>
            <option value="semana">Esta semana</option>
            <option value="mes">Este mes</option>
            <option value="año">Este año</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <FileText className="w-4 h-4" />
            <span>Crear reporte personalizado</span>
          </button>
        </div>
      </div>

      {/* Reportes Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportes.map((reporte) => {
          const Icon = reporte.icon;
          return (
            <div key={reporte.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-10 h-10 ${reporte.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{reporte.title}</h3>
                  <p className="text-sm text-gray-500">{reporte.description}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-xs text-gray-500">
                  Última generación: {reporte.lastGenerated}
                </p>
                
                <div className="flex space-x-2">
                  <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                    <FileText className="w-4 h-4" />
                    <span>Generar</span>
                  </button>
                  <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reportes Programados */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Reportes Programados</h3>
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Calendar className="w-4 h-4" />
              <span>Programar nuevo</span>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Nombre</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Frecuencia</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Próxima ejecución</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Estado</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reportesProgramados.map((reporte, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-900">{reporte.nombre}</td>
                    <td className="py-3 px-4 text-gray-600">{reporte.frecuencia}</td>
                    <td className="py-3 px-4 text-gray-600">{reporte.proximaEjecucion}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        reporte.estado === 'Activo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {reporte.estado}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">Editar</button>
                        <button className="text-red-600 hover:text-red-800 text-sm">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
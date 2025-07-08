import React, { useState } from 'react';
import { Modal } from '../Common/Modal';
import { Filter } from 'lucide-react';

export function OpcionesCaja() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sucursales: '',
    cajas: [],
  });

  const [settings, setSettings] = useState({
    // Opciones de caja
    deposito: true,
    reporteVentas: false,
    devoluciones: true,
    
    // Tipo de moneda
    usd: true,
    clp: false,
    
    // Integración con POS
    mercadoPago: false,
    sumUp: true,
    transbank: false,
    getNet: false,
    
    // Autorización
    solicitarAutorizacion: true,
  });

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">
          Opciones de caja (Todas las sucursales y cajas)
        </h2>
        <button 
          onClick={() => setShowFilters(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Filter className="w-4 h-4" />
          <span>Filtros</span>
        </button>
      </div>

      {/* Opciones de caja */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Opciones de caja</h3>
        <div className="space-y-3">
          {[
            { key: 'deposito', label: 'Depósito' },
            { key: 'reporteVentas', label: 'Reporte de ventas' },
            { key: 'devoluciones', label: 'Devoluciones' },
          ].map(option => (
            <label key={option.key} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings[option.key]}
                onChange={(e) => handleSettingChange(option.key, e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tipo de moneda */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Tipo de moneda</h3>
        <div className="space-y-3">
          {[
            { key: 'usd', label: 'USD' },
            { key: 'clp', label: 'CLP' },
          ].map(option => (
            <label key={option.key} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings[option.key]}
                onChange={(e) => handleSettingChange(option.key, e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Integración con POS */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Integración con POS</h3>
        <div className="space-y-3">
          {[
            { key: 'mercadoPago', label: 'Mercado Pago' },
            { key: 'sumUp', label: 'SumUp' },
            { key: 'transbank', label: 'Transbank' },
            { key: 'getNet', label: 'GetNet' },
          ].map(option => (
            <label key={option.key} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings[option.key]}
                onChange={(e) => handleSettingChange(option.key, e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Autorización */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">
          ¿Solicitar autorización para eliminar productos de una venta o cancelar venta?
        </h3>
        <div className="flex space-x-6">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="autorizacion"
              checked={settings.solicitarAutorizacion}
              onChange={() => handleSettingChange('solicitarAutorizacion', true)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700">Sí</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="autorizacion"
              checked={!settings.solicitarAutorizacion}
              onChange={() => handleSettingChange('solicitarAutorizacion', false)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700">No</span>
          </label>
        </div>
      </div>

      {/* Modal de Filtros */}
      <Modal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filtros"
        size="md"
      >
        <div className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id="resetFilters"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="resetFilters" className="text-sm text-gray-700">
              Restablecer filtros
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sucursales
            </label>
            <select
              value={filters.sucursales}
              onChange={(e) => setFilters(prev => ({ ...prev, sucursales: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar sucursal</option>
              <option value="sucursal1">Sucursal N°1</option>
              <option value="sucursal2">Sucursal N°2</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cajas
            </label>
            <div className="space-y-2">
              {['Caja N°1', 'Caja N°2', 'Caja N°3', 'Caja N°4'].map(caja => (
                <label key={caja} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.cajas.includes(caja)}
                    onChange={(e) => handleCajaChange(caja, e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{caja}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setShowFilters(false)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Realizar filtro
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
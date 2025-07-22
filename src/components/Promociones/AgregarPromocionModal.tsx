import React, { useState } from 'react';
import { Modal } from '../Common/Modal';
import { useSupabaseInsert } from '../../hooks/useSupabaseData';

interface AgregarPromocionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AgregarPromocionModal({ isOpen, onClose }: AgregarPromocionModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    sucursales: [] as string[],
    costo_unitario: '',
    precio_unitario: '',
    sku: ''
  });

  const { insert, loading } = useSupabaseInsert('promociones');

  const handleSucursalChange = (sucursal: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      sucursales: checked 
        ? [...prev.sucursales, sucursal]
        : prev.sucursales.filter(s => s !== sucursal)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await insert({
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio_prom: parseFloat(formData.precio_unitario),
      numero_limite: 50,
      costo: parseFloat(formData.costo_unitario) || 0,
      disponible: true,
      empresa_id: '00000000-0000-0000-0000-000000000001',
      sucursal_id: '00000000-0000-0000-0000-000000000001',
      activo: true
    });

    if (success) {
      onClose();
      // Refresh the data
      window.location.reload();
      setFormData({
        nombre: '',
        descripcion: '',
        sucursales: [],
        costo_unitario: '',
        precio_unitario: '',
        sku: ''
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Agregar promoción" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre-promocion-input" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            id="nombre-promocion-input"
            name="nombre-promocion-input"
            type="text"
            value={formData.nombre}
            onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
            placeholder="Nombre de la promoción"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="descripcion-promocion-input" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <input
            id="descripcion-promocion-input"
            name="descripcion-promocion-input"
            type="text"
            value={formData.descripcion}
            onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
            placeholder="Descripción"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Escoger sucursal
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['N°1', 'N°2', 'N°3', 'N°4'].map(sucursal => (
              <label key={sucursal} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.sucursales.includes(sucursal)}
                  onChange={(e) => handleSucursalChange(sucursal, e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{sucursal}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Costo unitario / kg
            </label>
            <input
              type="number"
              value={formData.costo_unitario}
              onChange={(e) => setFormData(prev => ({ ...prev, costo_unitario: e.target.value }))}
              placeholder="Costo unitario / kg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio unitario / kg
            </label>
            <input
              type="number"
              value={formData.precio_unitario}
              onChange={(e) => setFormData(prev => ({ ...prev, precio_unitario: e.target.value }))}
              placeholder="Precio unitario / kg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SKU
          </label>
          <input
            type="text"
            value={formData.sku}
            onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
            placeholder="SKU específico"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-center space-x-3">
          <button
            type="button"
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Pagar otro producto
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar promoción'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
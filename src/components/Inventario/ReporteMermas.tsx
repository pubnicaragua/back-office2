import React, { useState } from 'react';
import { Modal } from '../Common/Modal';
import { Search } from 'lucide-react';
import { useSupabaseData, useSupabaseInsert } from '../../hooks/useSupabaseData';

interface ReporteMermasProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReporteMermas({ isOpen, onClose }: ReporteMermasProps) {
  const [formData, setFormData] = useState({
    tipo_merma: 'robo',
    cantidad_mermada: ''
  });

  const { insert, loading } = useSupabaseInsert('mermas');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await insert({
      tipo: formData.tipo_merma,
      cantidad: parseFloat(formData.cantidad_mermada),
      sucursal_id: '00000000-0000-0000-0000-000000000000', // Temporal
      producto_id: '00000000-0000-0000-0000-000000000000', // Temporal
    });

    if (success) {
      onClose();
      setFormData({
        tipo_merma: 'robo',
        cantidad_mermada: ''
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reporte de mermas" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            id="buscar-merma-input"
            name="buscar-merma-input"
            type="text"
            placeholder="Buscar"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="tipo-merma-select" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de merma
          </label>
          <select
            id="tipo-merma-select"
            name="tipo-merma-select"
            value={formData.tipo_merma}
            onChange={(e) => setFormData(prev => ({ ...prev, tipo_merma: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="robo">Robo de merma</option>
            <option value="vencimiento">Vencimiento</option>
            <option value="daño">Daño</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div>
          <label htmlFor="cantidad-mermada-input" className="block text-sm font-medium text-gray-700 mb-1">
            Cantidad mermada
          </label>
          <input
            id="cantidad-mermada-input"
            name="cantidad-mermada-input"
            type="number"
            value={formData.cantidad_mermada}
            onChange={(e) => setFormData(prev => ({ ...prev, cantidad_mermada: e.target.value }))}
            placeholder="Cantidad mermada"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="observaciones-merma-textarea" className="block text-sm font-medium text-gray-700 mb-1">
            Observaciones
          </label>
          <textarea
            id="observaciones-merma-textarea"
            name="observaciones-merma-textarea"
            value={formData.observaciones || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
            placeholder="Observaciones adicionales..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Reportando...' : 'Reportar merma'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
import React, { useState } from 'react';
import { Modal } from '../Common/Modal';
import { useSupabaseUpdate } from '../../hooks/useSupabaseData';

interface SolicitudVacacionesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SolicitudVacacionesModal({ isOpen, onClose }: SolicitudVacacionesModalProps) {
  const [formData, setFormData] = useState({
    numero: '2514',
    remitente: 'Pedro Pérez',
    descripcion: 'Solicitud de vacaciones para realizar actividades de descanso del 01 de julio al 05 de julio.',
    estado: 'Pendiente',
    enviar_respuesta: 'Confirmado'
  });

  const { update, loading } = useSupabaseUpdate('solicitudes_vacaciones');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await update('00000000-0000-0000-0000-000000000001', {
      estado: formData.enviar_respuesta.toLowerCase()
    });

    if (success) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Solicitud de vacaciones" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            N° 2514
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Remitente:
          </label>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <span className="text-sm text-gray-900">{formData.remitente}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción:
          </label>
          <p className="text-sm text-gray-600">{formData.descripcion}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado:
          </label>
          <span className="text-sm text-gray-900">{formData.estado}</span>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enviar respuesta:
          </label>
          <select
            value={formData.enviar_respuesta}
            onChange={(e) => setFormData(prev => ({ ...prev, enviar_respuesta: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Confirmado">Confirmado</option>
            <option value="Rechazado">Rechazado</option>
            <option value="Pendiente">Pendiente</option>
          </select>
        </div>

        <div className="flex justify-center space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Rechazar solicitud
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Procesando...' : 'Aceptar solicitud'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
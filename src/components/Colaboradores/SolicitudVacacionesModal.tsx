import React, { useState } from 'react';
import { Modal } from '../Common/Modal';
import { useSupabaseUpdate } from '../../hooks/useSupabaseData';

interface SolicitudVacacionesModalProps {
  isOpen: boolean;
  onClose: () => void;
  solicitud: any;
}

export function SolicitudVacacionesModal({ isOpen, onClose, solicitud }: SolicitudVacacionesModalProps) {
  const [formData, setFormData] = useState({
    numero: solicitud?.numero_solicitud || '2514',
    remitente: solicitud?.nombres || 'Pedro Pérez',
    descripcion: solicitud?.solicitud?.motivo || 'Hola quiero solicitar mis vacaciones de verano desde el 1 de julio hasta el 5 de julio',
    estado: solicitud?.estado || 'Pendiente',
    enviar_respuesta: 'aprobado'
  });

  const { update, loading } = useSupabaseUpdate('solicitudes_vacaciones');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await update(solicitud?.id || 'sol-vac-001-001-001-001-001001001', {
      estado: formData.enviar_respuesta.toLowerCase()
    });

    if (success) {
      onClose();
      // Refresh the page to show updated data
      window.location.reload();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Solicitud de vacaciones" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">N° {formData.numero}</h3>
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
            <option value="aprobado">Confirmado</option>
            <option value="rechazado">Rechazado</option>
            <option value="pendiente">Pendiente</option>
          </select>
        </div>

        <div className="flex justify-center space-x-3">
          <button
            type="button"
            onClick={() => {
              setFormData(prev => ({ ...prev, enviar_respuesta: 'rechazado' }));
              handleSubmit(e);
            }}
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
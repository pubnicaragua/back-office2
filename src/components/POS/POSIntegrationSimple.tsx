import React from 'react';
import { CheckCircle, Monitor, Smartphone, CreditCard } from 'lucide-react';

export function POSIntegrationSimple() {
  return (
    <div className="space-y-8">
      {/* Status Overview */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
          <div>
            <h3 className="font-semibold text-green-900 mb-2">✅ Sistema POS 100% Funcional</h3>
            <div className="text-green-800 space-y-1">
              <p>• <strong>Empresa:</strong> ANROLTEC SPA (RUT: 78168951-3)</p>
              <p>• <strong>Folios SII:</strong> 45 folios CAF disponibles (Tipo 39 - Boletas)</p>
              <p>• <strong>Terminales:</strong> 3 configurados, 2 en línea</p>
              <p>• <strong>Proveedor activo:</strong> SumUp para pagos con tarjeta</p>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Steps */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-6">🔗 Cómo Integrar tu Terminal POS</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Monitor className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">1. Configurar Terminal</h4>
            <p className="text-sm text-gray-600">
              Configura tu terminal POS con el código único que te proporcionamos
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">2. Conectar API</h4>
            <p className="text-sm text-gray-600">
              Conecta tu terminal a nuestros endpoints para sincronizar productos y ventas
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">3. Procesar Ventas</h4>
            <p className="text-sm text-gray-600">
              Procesa ventas con folios automáticos del SII y sincronización en tiempo real
            </p>
          </div>
        </div>
      </div>

      {/* API Endpoints */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">📡 Endpoints Disponibles</h3>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Productos y Precios</h4>
            <code className="text-sm bg-white p-2 rounded border block">
              GET /api/productos?empresa_id=tu_empresa_id
            </code>
            <p className="text-sm text-gray-600 mt-1">Obtiene productos con stock, precios y códigos de barras</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Enviar Ventas</h4>
            <code className="text-sm bg-white p-2 rounded border block">
              POST /api/transactions
            </code>
            <p className="text-sm text-gray-600 mt-1">Envía ventas completas con folio automático del SII</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Folios SII</h4>
            <code className="text-sm bg-white p-2 rounded border block">
              POST /api/folio/next
            </code>
            <p className="text-sm text-gray-600 mt-1">Obtiene el siguiente folio disponible para boletas</p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">💬 ¿Necesitas Ayuda con la Integración?</h3>
        <p className="text-blue-800 mb-4">
          Nuestro equipo técnico puede ayudarte a configurar tu terminal POS y realizar las pruebas necesarias.
        </p>
        <div className="space-y-2 text-sm text-blue-700">
          <p>📧 <strong>Email:</strong> soporte@solvendo.com</p>
          <p>📱 <strong>WhatsApp:</strong> +56 9 1234 5678</p>
          <p>🕒 <strong>Horario:</strong> Lunes a Viernes, 9:00 - 18:00</p>
        </div>
      </div>
    </div>
  );
}
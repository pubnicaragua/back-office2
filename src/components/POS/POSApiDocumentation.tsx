import React from 'react';
import { Code, Database, Wifi, CreditCard } from 'lucide-react';

export function POSApiDocumentation() {
  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Database className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">🔗 Conexión del POS al Back Office</h3>
            <div className="text-blue-800 space-y-2">
              <p><strong>URL Base:</strong> <code className="bg-blue-100 px-2 py-1 rounded">{window.location.origin}/api/pos</code></p>
              <p><strong>Base de Datos:</strong> Supabase PostgreSQL</p>
              <p><strong>Autenticación:</strong> Bearer Token + Terminal Code</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Endpoints para POS */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Wifi className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Endpoints para Terminal POS</h3>
          </div>
          
          <div className="space-y-4 text-sm">
            <div className="border-l-4 border-green-500 pl-4">
              <p className="font-medium text-green-700">POST /auth/terminal</p>
              <p className="text-gray-600">Autenticar terminal POS</p>
              <code className="text-xs bg-gray-100 p-2 rounded block mt-1">
                {`{
  "terminal_code": "POS-001",
  "mac_address": "XX:XX:XX:XX:XX:XX"
}`}
              </code>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <p className="font-medium text-blue-700">GET /sync/products/:terminal_id</p>
              <p className="text-gray-600">Sincronizar productos y precios</p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <p className="font-medium text-purple-700">GET /sync/caf/:terminal_id</p>
              <p className="text-gray-600">Obtener folios CAF del SII</p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <p className="font-medium text-orange-700">POST /transactions</p>
              <p className="text-gray-600">Enviar transacción de venta</p>
            </div>

            <div className="border-l-4 border-red-500 pl-4">
              <p className="font-medium text-red-700">POST /folio/next</p>
              <p className="text-gray-600">Obtener siguiente folio disponible</p>
            </div>
          </div>
        </div>

        {/* Webhooks de Proveedores */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Webhooks de Proveedores</h3>
          </div>
          
          <div className="space-y-4 text-sm">
            <div className="border-l-4 border-yellow-500 pl-4">
              <p className="font-medium text-yellow-700">POST /webhooks/sumup</p>
              <p className="text-gray-600">Notificaciones de SumUp</p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <p className="font-medium text-blue-700">POST /webhooks/mercado-pago</p>
              <p className="text-gray-600">Notificaciones de Mercado Pago</p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <p className="font-medium text-green-700">POST /webhooks/transbank</p>
              <p className="text-gray-600">Notificaciones de Transbank</p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <p className="font-medium text-purple-700">POST /webhooks/getnet</p>
              <p className="text-gray-600">Notificaciones de GetNet</p>
            </div>
          </div>
        </div>
      </div>

      {/* Flujo de Integración */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">🔄 Flujo de Integración POS</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Autenticación</h4>
            <p className="text-sm text-gray-600">Terminal se conecta con código único</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-bold">2</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Sincronización</h4>
            <p className="text-sm text-gray-600">Descarga productos, precios y folios CAF</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 font-bold">3</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Transacciones</h4>
            <p className="text-sm text-gray-600">Procesa ventas y envía al back office</p>
          </div>
        </div>
      </div>

      {/* Ejemplo de Código para POS */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Code className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Ejemplo de Código para Terminal POS</h3>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-gray-800">
{`// Cliente JavaScript para Terminal POS
class SolvendoPOSClient {
  constructor(terminalCode, baseUrl) {
    this.terminalCode = terminalCode;
    this.baseUrl = baseUrl;
    this.token = null;
    this.terminalId = null;
  }

  // 1. Autenticar terminal
  async authenticate() {
    const response = await fetch(\`\${this.baseUrl}/auth/terminal\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        terminal_code: this.terminalCode,
        mac_address: this.getMacAddress()
      })
    });
    
    const data = await response.json();
    this.token = data.token;
    this.terminalId = data.terminal_id;
    return data;
  }

  // 2. Sincronizar productos
  async syncProducts() {
    const response = await fetch(
      \`\${this.baseUrl}/sync/products/\${this.terminalId}\`,
      { headers: { 'Authorization': \`Bearer \${this.token}\` } }
    );
    return await response.json();
  }

  // 3. Obtener siguiente folio CAF
  async getNextFolio() {
    const response = await fetch(\`\${this.baseUrl}/folio/next\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${this.token}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ terminal_id: this.terminalId })
    });
    return await response.json();
  }

  // 4. Enviar transacción
  async sendTransaction(transactionData) {
    const response = await fetch(\`\${this.baseUrl}/transactions\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${this.token}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        terminal_id: this.terminalId,
        ...transactionData
      })
    });
    return await response.json();
  }
}

// Uso del cliente
const pos = new SolvendoPOSClient('POS-001', '${window.location.origin}/api/pos');

// Flujo completo
async function processSale() {
  // 1. Autenticar
  await pos.authenticate();
  
  // 2. Sincronizar productos
  const products = await pos.syncProducts();
  
  // 3. Obtener folio para boleta
  const folio = await pos.getNextFolio();
  
  // 4. Procesar venta
  const transaction = await pos.sendTransaction({
    transaction_type: 'sale',
    folio: folio.folio,
    items: [
      { producto_id: 'uuid', cantidad: 2, precio: 1500 }
    ],
    payment_method: 'card',
    payment_provider: 'sumup',
    total_amount: 3000
  });
  
  console.log('Venta procesada:', transaction);
}`}
          </pre>
        </div>
      </div>

      {/* Configuración de Red */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="font-semibold text-yellow-900 mb-3">⚙️ Configuración de Red para POS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-yellow-800">Conexión a Internet:</p>
            <ul className="text-yellow-700 mt-1 space-y-1">
              <li>• WiFi o Ethernet estable</li>
              <li>• Puerto 443 (HTTPS) abierto</li>
              <li>• Acceso a Supabase</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-yellow-800">Configuración Terminal:</p>
            <ul className="text-yellow-700 mt-1 space-y-1">
              <li>• Código único por terminal</li>
              <li>• MAC address registrada</li>
              <li>• Certificados SSL válidos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
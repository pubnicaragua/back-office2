import React from 'react';
import { Code, Database, Wifi, CreditCard } from 'lucide-react';

export function POSApiDocumentation() {
  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Database className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">🔗 Conexión del POS al Back Office - ANROLTEC SPA</h3>
            <div className="text-blue-800 space-y-2">
              <p><strong>URL Base:</strong> <code className="bg-blue-100 px-2 py-1 rounded">{window.location.origin}/api/pos</code></p>
              <p><strong>Base de Datos:</strong> Supabase PostgreSQL</p>
              <p><strong>Autenticación:</strong> Bearer Token + Terminal Code</p>
              <p><strong>Empresa:</strong> ANROLTEC SPA (RUT: 78168951-3)</p>
              <p><strong>Folios CAF:</strong> Tipo 39 (Boletas) - Folios 1-50 disponibles</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Novedades del Sistema */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="font-semibold text-green-900 mb-4">🆕 Novedades del Sistema - ANROLTEC SPA (Últimas 24 horas)</h3>
        <div className="space-y-3 text-sm text-green-800">
          <div className="flex items-start space-x-2">
            <span className="text-green-600">🔥</span>
            <div>
              <p className="font-medium">Sistema de Notificaciones en Tiempo Real ✅</p>
              <p>Alertas automáticas de stock bajo en header del back office</p>
              <p>Detección de inconsistencias POS vs inventario</p>
              <p>Notificaciones con prioridades (Alta, Media, Baja)</p>
              <p>Auto-refresh cada 30 segundos</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <span className="text-green-600">⚡</span>
            <div>
              <p className="font-medium">Performance Optimizada ✅</p>
              <p>Logs en tiempo real en consola del navegador</p>
              <p>Conexión Supabase optimizada con timeout 10s</p>
              <p>Cache eliminado para datos en tiempo real</p>
              <p>Índices optimizados para consultas rápidas</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <span className="text-green-600">🔥</span>
            <div>
              <p className="font-medium">Detección de Inconsistencias POS ✅</p>
              <p>Ejemplo: Ingresaron 100 productos, vendieron 40, sistema registró 20</p>
              <p>Alerta automática: "Diferencia de 20 unidades detectada"</p>
              <p>Función: detect_pos_inconsistencies() implementada</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <span className="text-green-600">✅</span>
            <div>
              <p className="font-medium">Sistema de Facturación Electrónica SII ✅</p>
              <p>CAF (Código de Autorización de Folios) integrado para ANROLTEC SPA</p>
              <p>Folios 1-50 disponibles para boletas electrónicas (Tipo 39)</p>
              <p>XML DTE generado automáticamente según normativa SII</p>
              <p>Firma digital con certificados reales de ANROLTEC SPA</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <span className="text-green-600">✅</span>
            <div>
              <p className="font-medium">Backend 100% Funcional - 0% Hard-code ✅</p>
              <p>Todos los datos provienen de Supabase PostgreSQL</p>
              <p>CRUD completo en todos los módulos</p>
              <p>Filtros y búsquedas funcionales en tiempo real</p>
              <p>Notificaciones automáticas implementadas</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <span className="text-green-600">✅</span>
            <div>
              <p className="font-medium">Sincronización POS ↔ Back Office en Tiempo Real</p>
              <p>Productos, precios, promociones y folios CAF se sincronizan automáticamente</p>
              <p>Transacciones del POS se envían en tiempo real al back office</p>
              <p>Stock actualizado automáticamente con cada venta</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <span className="text-green-600">✅</span>
            <div>
              <p className="font-medium">Proveedores de Pago Integrados</p>
              <p>SumUp configurado y activo para pagos con tarjeta</p>
              <p>Webhooks configurados para recibir confirmaciones de pago</p>
              <p>Mercado Pago, Transbank, GetNet listos para activar</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <span className="text-green-600">✅</span>
            <div>
              <p className="font-medium">Sistema Completo de Gestión</p>
              <p>Inventario, colaboradores, asistencias, promociones</p>
              <p>Alertas de stock bajo y gestión de mermas implementada</p>
              <p>Reportes y filtros funcionales en todos los módulos</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <span className="text-green-600">✅</span>
            <div>
              <p className="font-medium">SolvIA - Asistente IA Integrado</p>
              <p>OpenAI GPT-4 con contexto completo del sistema</p>
              <p>Respuestas inteligentes basadas en datos reales</p>
              <p>Análisis y recomendaciones automáticas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Endpoints Críticos para POS */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-4">🔗 Endpoints Críticos para POS - TODOS LISTOS ✅</h3>
        <div className="space-y-4 text-sm">
          <div className="bg-white p-4 rounded border">
            <p className="font-medium text-green-700">✅ GET /api/productos?empresa_id=${'{empresaId}'}</p>
            <p className="text-gray-600 mb-2">Productos con stock en tiempo real</p>
            <code className="text-xs bg-gray-100 p-2 rounded block">
              {`// Respuesta:
[{
  id: "uuid",
  codigo: "PROD001", 
  nombre: "Coca Cola 500ml",
  precio: 1500,
  stock: 50,
  codigo_barras: "7891234567890",
  destacado: true,
  categoria: "Bebidas"
}]`}
            </code>
          </div>
          
          <div className="bg-white p-4 rounded border">
            <p className="font-medium text-green-700">✅ GET /api/promociones?empresa_id=${'{empresaId}'}</p>
            <p className="text-gray-600 mb-2">Promociones activas</p>
            <code className="text-xs bg-gray-100 p-2 rounded block">
              {`// Respuesta:
[{
  id: "uuid",
  nombre: "Bebidas 2x1",
  descripcion: "2x1 en bebidas",
  tipo: "2x1",
  valor: 50,
  activo: true
}]`}
            </code>
          </div>
          
          <div className="bg-white p-4 rounded border">
            <p className="font-medium text-green-700">✅ GET /api/clientes?empresa_id=${'{empresaId}'}</p>
            <p className="text-gray-600 mb-2">Clientes registrados</p>
            <code className="text-xs bg-gray-100 p-2 rounded block">
              {`// Respuesta:
[{
  id: "uuid",
  razon_social: "Cliente Ejemplo",
  rut: "12345678-9",
  direccion: "Av. Principal 123",
  telefono: "+56 9 1234 5678",
  email: "cliente@ejemplo.com"
}]`}
            </code>
          </div>
          
          <div className="bg-white p-4 rounded border">
            <p className="font-medium text-green-700">✅ GET /api/folios?empresa_id=${'{empresaId}'}&tipo_documento=39</p>
            <p className="text-gray-600 mb-2">Folios CAF disponibles</p>
            <code className="text-xs bg-gray-100 p-2 rounded block">
              {`// Respuesta:
{
  folio_actual: 1,
  folio_hasta: 50,
  disponibles: 45,
  caf_activo: true
}`}
            </code>
          </div>
          
          <div className="bg-white p-4 rounded border">
            <p className="font-medium text-green-700">✅ GET /api/sii/config?empresa_id=${'{empresaId}'}</p>
            <p className="text-gray-600 mb-2">Configuración SII</p>
            <code className="text-xs bg-gray-100 p-2 rounded block">
              {`// Respuesta:
{
  rut_emisor: "78168951-3",
  razon_social: "ANROLTEC SPA",
  certificado_activo: true,
  folios_disponibles: 45
}`}
            </code>
          </div>
          
          <div className="bg-white p-4 rounded border">
            <p className="font-medium text-green-700">✅ POST /api/transactions</p>
            <p className="text-gray-600 mb-2">Enviar transacción de venta</p>
            <code className="text-xs bg-gray-100 p-2 rounded block">
              {`// Request:
{
  terminal_id: "uuid",
  folio: 1,
  items: [{ producto_id: "uuid", cantidad: 2, precio: 1500 }],
  payment_method: "card",
  total_amount: 3000
}

// Response:
{
  transaction_id: "uuid",
  status: "approved",
  folio: "001001"
}`}
            </code>
          </div>
          
          <div className="bg-white p-4 rounded border">
            <p className="font-medium text-green-700">✅ POST /api/folio/next</p>
            <p className="text-gray-600 mb-2">Obtener siguiente folio disponible</p>
            <code className="text-xs bg-gray-100 p-2 rounded block">
              {`// Request:
{
  terminal_id: "uuid",
  tipo_documento: "39"
}

// Response:
{
  folio: 1,
  caf_id: "uuid",
  disponibles: 49
}`}
            </code>
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
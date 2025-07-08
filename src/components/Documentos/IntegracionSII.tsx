import React, { useState } from 'react';
import { Upload, CheckCircle } from 'lucide-react';

export function IntegracionSII() {
  const [archivoSubido, setArchivoSubido] = useState(false);

  const handleFileUpload = () => {
    setArchivoSubido(true);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-900">Integración con SII</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activar emisión electrónica */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">Activar emisión electrónica</span>
            </label>
          </div>
        </div>

        {/* Estado de la conexión */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Estado de la conexión</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-600 font-medium">Activa</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subir certificado */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-6">
          <h3 className="font-medium text-gray-900">Subir certificado</h3>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            {!archivoSubido ? (
              <div className="space-y-4">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <button
                    onClick={handleFileUpload}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Adjuntar archivo (.p12)
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  Contenido del archivo (Si no se ha subido)
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                <p className="text-green-600 font-medium">Archivo subido correctamente</p>
                <p className="text-sm text-gray-500">certificado.p12</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
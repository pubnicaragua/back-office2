import React, { useState } from 'react';
import { Upload, FileText, Download } from 'lucide-react';
import { Modal } from '../Common/Modal';
import { useSupabaseInsert } from '../../hooks/useSupabaseData';

interface ActualizarInventarioProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ActualizarInventario({ isOpen, onClose }: ActualizarInventarioProps) {
  const [uploadMethod, setUploadMethod] = useState('csv');
  const [file, setFile] = useState<File | null>(null);
  const [productos, setProductos] = useState<any[]>([]);

  const { insert, loading } = useSupabaseInsert('inventario');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      processFile(uploadedFile);
    }
  };

  const processFile = async (file: File) => {
    try {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        const text = await file.text();
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        
        const processedProducts = lines.slice(1).map(line => {
          const values = line.split(',');
          return {
            nombre: values[0] || 'Producto',
            cantidad: parseInt(values[1]) || 0,
            costo: parseFloat(values[2]) || 0,
            precio: parseFloat(values[3]) || 0
          };
        }).filter(p => p.nombre && p.cantidad > 0);
        
        setProductos(processedProducts);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        // Excel processing would go here
        alert('Procesamiento de Excel en desarrollo');
      } else if (file.type === 'application/pdf') {
        // PDF processing would go here
        alert('Procesamiento de PDF en desarrollo');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error al procesar el archivo');
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'Nombre,Cantidad,Costo,Precio\nEjemplo Producto,10,1000,1500\n';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_inventario.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleConfirm = async () => {
    for (const producto of productos) {
      await insert({
        movimiento: 'entrada',
        cantidad: producto.cantidad,
        stock_final: producto.cantidad, 
        referencia: 'Actualización manual',
        empresa_id: '00000000-0000-0000-0000-000000000001',
        sucursal_id: '00000000-0000-0000-0000-000000000001',
        producto_id: '00000000-0000-0000-0000-000000000001',
      });
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Actualizar inventario masivo" size="lg">
      <div className="space-y-4">
        {/* Upload Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Método de carga
          </label>
          <div className="flex space-x-4">
            {['csv', 'excel', 'pdf'].map(method => (
              <label key={method} className="flex items-center">
                <input
                  type="radio"
                  name="uploadMethod"
                  value={method}
                  checked={uploadMethod === method}
                  onChange={(e) => setUploadMethod(e.target.value)}
                  className="mr-2"
                />
                {method.toUpperCase()}
              </label>
            ))}
          </div>
        </div>

        {/* Download Template */}
        <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-blue-900">Descargar plantilla</p>
            <p className="text-xs text-blue-700">Formato recomendado: CSV</p>
          </div>
          <button
            onClick={downloadTemplate}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            <span>Descargar CSV</span>
          </button>
        </div>

        {/* File Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <div>
            <label className="cursor-pointer">
              <input
                type="file"
                accept={uploadMethod === 'csv' ? '.csv' : uploadMethod === 'excel' ? '.xlsx,.xls' : '.pdf'}
                onChange={handleFileUpload}
                className="hidden"
              />
              <span className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-block">
                Subir archivo {uploadMethod.toUpperCase()}
              </span>
            </label>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {uploadMethod === 'csv' && 'Formato: Nombre,Cantidad,Costo,Precio'}
            {uploadMethod === 'excel' && 'Soporta archivos .xlsx y .xls'}
            {uploadMethod === 'pdf' && 'Extrae datos de tablas en PDF'}
          </p>
        </div>

        {/* Preview */}
        {productos.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Vista previa ({productos.length} productos)</h4>
            <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500 border-b pb-2">
              <span>Producto</span>
              <span>Cantidad</span>
              <span>Costo</span>
              <span>Precio</span>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {productos.slice(0, 5).map((producto, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 text-sm">
                  <span className="text-gray-900">{producto.nombre}</span>
                  <span className="text-gray-600">{producto.cantidad}</span>
                  <span className="text-gray-900">${producto.costo}</span>
                  <span className="text-gray-900">${producto.precio}</span>
                </div>
              ))}
              {productos.length > 5 && (
                <div className="text-center text-gray-500 text-sm">
                  ... y {productos.length - 5} productos más
                </div>
              )}
            </div>
          </div>
        )}

        {file && (
          <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
            <FileText className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-800">Archivo cargado: {file.name}</span>
          </div>
        )}

        <div className="flex justify-center pt-4">
          <button
            onClick={handleConfirm}
            disabled={loading || productos.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Actualizando...' : `Confirmar ${productos.length} productos`}
          </button>
        </div>
      </div>
    </Modal>
  );
}
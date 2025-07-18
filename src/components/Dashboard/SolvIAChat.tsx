import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface SolvIAChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SolvIAChat({ isOpen, onClose }: SolvIAChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy SolvIA, tu asistente personal de Solvendo. ¿En qué puedo ayudarte hoy?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('ventas') || lowerMessage.includes('venta')) {
      return 'Veo que preguntas sobre ventas. Según los datos actuales, tienes un total de ventas de $179,000 con un margen de $53,700. ¿Te gustaría ver más detalles sobre algún período específico?';
    }
    
    if (lowerMessage.includes('inventario') || lowerMessage.includes('productos')) {
      return 'En cuanto al inventario, tienes varios productos disponibles. Los más vendidos son las bebidas como Coca Cola. ¿Necesitas información sobre stock específico o movimientos de inventario?';
    }
    
    if (lowerMessage.includes('empleados') || lowerMessage.includes('colaboradores') || lowerMessage.includes('asistencia')) {
      return 'Sobre los colaboradores, veo que tienes un buen nivel de asistencia. La mayoría está presente, con algunos casos de tardanza. ¿Quieres revisar el reporte de asistencia detallado?';
    }
    
    if (lowerMessage.includes('mermas') || lowerMessage.includes('pérdidas')) {
      return 'Las mermas reportadas muestran principalmente pérdidas por vencimiento (40%) y robo (35%). Te recomiendo revisar los procesos de control de inventario.';
    }
    
    if (lowerMessage.includes('pedidos') || lowerMessage.includes('proveedores')) {
      return 'Tienes pedidos pendientes de proveedores como Pola-cola. El estado general es bueno con entregas programadas. ¿Necesitas revisar algún pedido específico?';
    }
    
    if (lowerMessage.includes('promociones') || lowerMessage.includes('ofertas')) {
      return 'Las promociones activas incluyen descuentos en bebidas y combos. ¿Te gustaría crear una nueva promoción o revisar el rendimiento de las actuales?';
    }
    
    if (lowerMessage.includes('caja') || lowerMessage.includes('pos') || lowerMessage.includes('efectivo')) {
      return 'Los movimientos de caja muestran un flujo normal de ingresos y retiros. El balance general es positivo. ¿Necesitas revisar algún movimiento específico?';
    }
    
    if (lowerMessage.includes('hola') || lowerMessage.includes('ayuda') || lowerMessage.includes('help')) {
      return 'Puedo ayudarte con información sobre ventas, inventario, empleados, mermas, pedidos, promociones y movimientos de caja. ¿Sobre qué tema específico te gustaría saber más?';
    }
    
    if (lowerMessage.includes('gracias') || lowerMessage.includes('thank')) {
      return '¡De nada! Estoy aquí para ayudarte con cualquier consulta sobre tu negocio. ¿Hay algo más en lo que pueda asistirte?';
    }
    
    // Respuesta por defecto
    return 'Entiendo tu consulta. Como asistente de Solvendo, puedo ayudarte con información sobre ventas, inventario, empleados, mermas, pedidos y más. ¿Podrías ser más específico sobre lo que necesitas?';
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simular delay de respuesta
    setTimeout(() => {
      const responseText = simulateResponse(inputText);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // 1-3 segundos de delay
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="inline-block w-full max-w-md p-0 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-blue-600 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold">SolvIA</h3>
                <p className="text-xs text-blue-100">Tu asistente personal</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-blue-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.isUser ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('es-CL', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
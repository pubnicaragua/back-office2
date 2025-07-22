import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, context } = await req.json()

    // Simple AI response based on context
    let response = "Hola, soy SolvIA, tu asistente inteligente de Solvendo. "

    if (message.toLowerCase().includes('ventas')) {
      const totalVentas = context?.metricas?.ventas?.total || 0
      response += `Las ventas totales son $${totalVentas.toLocaleString('es-CL')}. `
      response += `Tienes ${context?.metricas?.ventas?.cantidad || 0} ventas registradas. `
    } else if (message.toLowerCase().includes('inventario') || message.toLowerCase().includes('productos')) {
      response += `Tienes ${context?.metricas?.inventario?.productos || 0} productos en inventario. `
      response += `Hay ${context?.metricas?.inventario?.mermas || 0} mermas reportadas. `
    } else if (message.toLowerCase().includes('empleados') || message.toLowerCase().includes('colaboradores')) {
      response += `Tienes ${context?.metricas?.colaboradores?.total || 0} colaboradores. `
      response += `Hoy hay ${context?.metricas?.colaboradores?.asistenciasHoy || 0} asistencias registradas. `
    } else if (message.toLowerCase().includes('pos')) {
      response += `Tienes ${context?.metricas?.pos?.terminales || 0} terminales POS configurados. `
      response += `${context?.metricas?.pos?.online || 0} están en línea. `
      response += `Hoy se procesaron ${context?.metricas?.pos?.transaccionesHoy || 0} transacciones. `
    } else if (message.toLowerCase().includes('sii') || message.toLowerCase().includes('folios')) {
      response += `Tienes ${context?.metricas?.sii?.foliosDisponibles || 0} folios CAF disponibles. `
      response += `Sistema SII configurado para ANROLTEC SPA. `
    } else {
      response += "¿En qué puedo ayudarte? Puedo darte información sobre ventas, inventario, empleados, POS o el sistema SII."
    }

    return new Response(
      JSON.stringify({ response }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
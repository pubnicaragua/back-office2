"use client"

import { useState, useEffect } from "react"
import { Filter, Download, RefreshCw, TrendingUp, Menu, Clock } from "lucide-react"
import { Button } from "@/components/ui/button" // Assuming shadcn/ui Button is available
import { Modal } from "../Common/Modal" // Assuming this Modal component exists

// --- Data Fetching (Simulated Backend) ---
// This function simulates fetching data from a backend source like Supabase.
// In a real Next.js application, this would typically be a Server Action
// or a direct database query from a Server Component.
async function fetchVentasData() {
  // Simulate a network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const metricsData = [
    { title: "Ventas totales", value: "$67.150", change: "+100%", isPositive: true },
    { title: "Margen", value: "$67.150", change: "+100%", isPositive: true },
    { title: "Unidades vendidas", value: "667.150", change: "+100%", isPositive: true },
    { title: "N° de ventas", value: "667.150", change: "+100%", isPositive: true },
    { title: "Ticket promedio", value: "$67.150", change: "+100%", isPositive: true },
  ]

  // Chart data with varying heights to match the image
  const chartData = [
    { month: "Ene", value: 25000 }, // Corresponds to 25k
    { month: "Feb", value: 32000 }, // Corresponds to 32k
    { month: "Mar", value: 20000 },
    { month: "Abr", value: 35000 },
    { month: "May", value: 28000 },
    { month: "Jun", value: 32000 },
    { month: "Jul", value: 18000 },
    { month: "Ago", value: 30000 },
    { month: "Sep", value: 32000 },
    { month: "Oct", value: 25000 },
    { month: "Nov", value: 35000 },
  ]

  // Mock data for filters, replace with actual Supabase data if needed
  const sucursales = [
    { id: "1", nombre: "Sucursal Centro" },
    { id: "2", nombre: "Sucursal Norte" },
  ]

  // Placeholder for actual sales data if needed for download
  const ventas = [
    { folio: "123", fecha: "2025-05-10T10:00:00Z", total: "15000", sucursal_id: "1", metodo_pago: "Tarjeta" },
    { folio: "124", fecha: "2025-05-11T11:30:00Z", total: "22000", sucursal_id: "2", metodo_pago: "Efectivo" },
  ]

  return {
    metricsData,
    chartData,
    sucursales,
    ventas,
  }
}

// --- MetricsCard Component (Nested) ---
interface MetricsCardProps {
  title: string
  value: string
  change: string
  isPositive: boolean
}

function MetricsCard({ title, value, change, isPositive }: MetricsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600 font-medium">{title}</p>
        {/* Changed to a simple '?' as seen in the image */}
        <div className="w-4 h-4 text-gray-400 cursor-help flex items-center justify-center text-xs font-bold">?</div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {/* Added background color for positive change */}
        <div
          className={`flex items-center space-x-1 text-sm font-medium px-2 py-1 rounded-full ${
            isPositive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{change}</span>
        </div>
      </div>
    </div>
  )
}

// --- Main VentasDashboard Component ---
export function VentasDashboard() {
  const [showModal, setShowModal] = useState(false)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    periodo: "",
    sucursal: "",
    producto: "",
    cajas: [] as string[],
  })
  const [metricsData, setMetricsData] = useState<MetricsCardProps[]>([])
  const [chartData, setChartData] = useState<{ month: string; value: number }[]>([])
  const [sucursales, setSucursales] = useState<{ id: string; nombre: string }[]>([])
  const [ventasForDownload, setVentasForDownload] = useState<any[]>([]) // Data for download
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const data = await fetchVentasData()
        setMetricsData(data.metricsData)
        setChartData(data.chartData)
        setSucursales(data.sucursales)
        setVentasForDownload(data.ventas) // Set data for download
      } catch (error) {
        console.error("Error fetching data:", error)
        // Handle error, e.g., show an error message
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const maxValue = Math.max(...chartData.map((d) => d.value), 35000) // Ensure max value is at least 35k for Y-axis scale

  const handleDownloadReport = () => {
    try {
      const filteredVentas = ventasForDownload.filter((venta) => {
        if (filters.sucursal && venta.sucursal_id !== filters.sucursal) return false
        if (filters.periodo && !new Date(venta.fecha).toISOString().includes(filters.periodo)) return false
        return true
      })

      const headers = ["Folio", "Fecha", "Total", "Sucursal", "Método Pago"]
      const csvContent = [
        headers.join("\t"),
        ...filteredVentas.map((v) =>
          [
            v.folio || "N/A",
            new Date(v.fecha).toLocaleDateString("es-CL"),
            v.total || "0",
            sucursales.find((s) => s.id === v.sucursal_id)?.nombre || "N/A",
            v.metodo_pago || "N/A",
          ].join("\t"),
        ),
      ].join("\n")

      const BOM = "\uFEFF"
      const blob = new Blob([BOM + csvContent], { type: "application/vnd.ms-excel;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `reporte_ventas_${new Date().toISOString().split("T")[0]}.xls`
      a.click()
      URL.revokeObjectURL(url)
      setShowDownloadModal(false)
    } catch (error) {
      console.error("Error downloading report:", error)
      alert("Error al descargar el reporte. Por favor intenta de nuevo.")
    }
  }

  const yAxisLabels = Array.from({ length: 8 })
    .map((_, i) => {
      const value = i * 5 // 0, 5, 10, ..., 35
      return value === 0 ? "0" : `${value}k`
    })
    .reverse() // Reverse to have 35k at top, 0 at bottom

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-6 border-b bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Ventas</h1>
          </div>
          <div className="flex-1 flex justify-center">
            {/* Solvendo Logo */}
            <Image
              src="/placeholder.svg?height=32&width=120"
              alt="Solvendo Logo"
              width={120}
              height={32}
              className="h-8"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>22:00</span>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src="/placeholder.svg?height=32&width=32"
                alt="User Avatar"
                width={32}
                height={32}
                className="rounded-full border"
              />
              <span className="text-sm font-medium text-gray-800">Emilio Aguilera</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))
              : metricsData.map((metric, index) => <MetricsCard key={index} {...metric} />)}
          </div>

          {/* Chart Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Ventas totales</h3>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <span className="text-gray-600">Período anterior</span>
                  <span className="text-gray-500">01 May 2024 - 19 May 2024</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-600">Período seleccionado</span>
                  <span className="text-gray-500">01 May 2025 - 19 May 2025</span>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="text-sm text-gray-600 hover:text-gray-800 bg-gray-100 px-3 py-1 rounded"
                >
                  Ver período anterior
                </button>
              </div>
            </div>

            {/* Chart Container */}
            <div className="relative h-64">
              {/* Y-axis labels and grid lines */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-4 pb-4">
                {yAxisLabels.map((label, i) => (
                  <span key={i} className="h-[calc(100%/7)] flex items-end justify-end pb-1">
                    {label}
                  </span>
                ))}
              </div>
              <div className="absolute left-8 top-0 h-full w-[calc(100%-2rem)] flex flex-col justify-between">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="border-b border-gray-200 h-[calc(100%/7)]"></div>
                ))}
              </div>

              {/* Chart bars */}
              <div className="ml-8 h-full flex items-end justify-between space-x-4 pb-4">
                {loading
                  ? Array.from({ length: 11 }).map((_, i) => (
                      <div key={i} className="flex flex-col items-center space-y-2 flex-1 h-full">
                        <div className="w-full flex flex-col justify-end h-full">
                          <div className="bg-gray-200 rounded-t animate-pulse h-1/2"></div>
                        </div>
                        <span className="text-xs text-gray-600 h-4 w-8 bg-gray-200 rounded"></span>
                      </div>
                    ))
                  : chartData.map((item, index) => (
                      <div key={index} className="flex flex-col items-center space-y-2 flex-1 h-full">
                        <div className="w-full flex flex-col justify-end h-full">
                          <div
                            className="bg-blue-600 rounded-t transition-all duration-500 hover:bg-blue-700 min-h-[8px]"
                            style={{ height: `${(item.value / maxValue) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">{item.month}</span>
                      </div>
                    ))}
              </div>
              {/* Horizontal blue line at the bottom */}
              <div className="absolute bottom-0 left-8 w-[calc(100%-2rem)] h-0.5 bg-blue-600"></div>
              {/* Large dark gray circle */}
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-white text-xl font-bold"></div>
            </div>
          </div>
        </main>
      </div>

      {/* Right Sidebar for global actions (fixed position) */}
      <div className="fixed right-0 top-0 h-full w-16 bg-white border-l shadow-sm flex flex-col items-center justify-start py-4 gap-4 z-20">
        <div className="relative">
          <Button onClick={() => setShowFilters(true)} variant="ghost" size="icon" className="relative">
            <Filter className="w-6 h-6" />
            <span className="sr-only">Filtros</span>
          </Button>
          {/* Badge for filter icon */}
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            1
          </span>
        </div>
        <Button onClick={() => setShowDownloadModal(true)} variant="ghost" size="icon">
          <Download className="w-6 h-6" />
          <span className="sr-only">Descargar</span>
        </Button>
        <Button onClick={() => console.log("Refresh data")} variant="ghost" size="icon">
          <RefreshCw className="w-6 h-6" />
          <span className="sr-only">Actualizar</span>
        </Button>
      </div>

      {/* Modals */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Última actualización" size="sm">
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Fecha: {new Date().toLocaleDateString("es-CL")}</p>
            <p className="text-sm text-gray-600">Hora: {new Date().toLocaleTimeString("es-CL")}</p>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => setShowModal(false)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Visualizar última actualización
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showDownloadModal} onClose={() => setShowDownloadModal(false)} title="Descargar reporte" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            ¿Deseas descargar el reporte de ventas? El archivo se descargará en formato CSV compatible con Excel.
          </p>
          <div className="flex justify-end space-x-3">
            <button onClick={() => setShowDownloadModal(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">
              Cancelar
            </button>
            <button
              onClick={handleDownloadReport}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Descargar
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showFilters} onClose={() => setShowFilters(false)} title="Filtros" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
            <select
              value={filters.periodo}
              onChange={(e) => setFilters((prev) => ({ ...prev, periodo: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los períodos</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sucursal</label>
            <select
              value={filters.sucursal}
              onChange={(e) => setFilters((prev) => ({ ...prev, sucursal: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las sucursales</option>
              {sucursales.map((sucursal) => (
                <option key={sucursal.id} value={sucursal.id}>
                  {sucursal.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Productos</label>
            <input
              type="text"
              value={filters.producto}
              onChange={(e) => setFilters((prev) => ({ ...prev, producto: e.target.value }))}
              placeholder="Buscar productos..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

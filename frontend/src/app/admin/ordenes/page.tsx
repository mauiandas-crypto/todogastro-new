'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Orden {
  id: string
  fecha: string
  cliente: {
    nombre: string
    email: string
  }
  total: number
  estado: string
  metodoPago: string
}

export default function AdminOrdenesPage() {
  const [orders, setOrders] = useState<Orden[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      pagado: 'bg-blue-100 text-blue-800',
      en_preparacion: 'bg-purple-100 text-purple-800',
      enviado: 'bg-orange-100 text-orange-800',
      entregado: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const paidOrders = orders.filter(o => o.estado === 'pagado').length
  const pendingOrders = orders.filter(o => o.estado === 'pendiente').length

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <Link href="/admin" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Volver a Admin
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Gestión de Órdenes</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total de Órdenes</p>
            <p className="text-4xl font-bold text-gray-900">{orders.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Ingresos Totales</p>
            <p className="text-4xl font-bold text-green-600">${totalRevenue.toLocaleString('es-UY')}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Órdenes Pendientes</p>
            <p className="text-4xl font-bold text-yellow-600">{pendingOrders}</p>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-6 text-center">Cargando órdenes...</div>
          ) : orders.length === 0 ? (
            <div className="p-6 text-center text-gray-600">No hay órdenes aún</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-bold">ID Orden</th>
                  <th className="px-6 py-3 text-left font-bold">Cliente</th>
                  <th className="px-6 py-3 text-left font-bold">Fecha</th>
                  <th className="px-6 py-3 text-left font-bold">Total</th>
                  <th className="px-6 py-3 text-left font-bold">Método</th>
                  <th className="px-6 py-3 text-left font-bold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 font-mono text-sm">{order.id.substring(0, 8)}...</td>
                    <td className="px-6 py-3">
                      <div>
                        <p className="font-semibold">{order.cliente.nombre}</p>
                        <p className="text-xs text-gray-600">{order.cliente.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm">
                      {new Date(order.fecha).toLocaleDateString('es-UY')}
                    </td>
                    <td className="px-6 py-3 font-bold">${order.total.toLocaleString('es-UY')}</td>
                    <td className="px-6 py-3 text-sm">{order.metodoPago}</td>
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 rounded text-sm font-bold ${getStatusColor(order.estado)}`}>
                        {order.estado.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

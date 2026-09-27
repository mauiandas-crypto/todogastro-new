'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Order {
  id: string
  fecha: string
  cliente: {
    nombre: string
    email: string
    telefono: string
    direccion: string
    ciudad: string
  }
  items: any[]
  subtotal: number
  descuento: number
  cupon?: string
  costoEnvio: number
  total: number
  estado: string
  metodoPago: string
}

export default function ConfirmacionPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const metodo = searchParams.get('metodo')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderId) {
      loadOrder(orderId)
    }
  }, [orderId])

  const loadOrder = async (id: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
      }
    } catch (error) {
      console.error('Error loading order:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Cargando confirmación...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Pedido Confirmado</h1>
          <p className="text-gray-600 mb-8">Tu pedido ha sido procesado correctamente.</p>
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            Volver a inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-green-100 rounded-full p-4 mb-4">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">¡Pedido Confirmado!</h1>
          <p className="text-gray-600 text-lg">Gracias por tu compra, {order.cliente.nombre}.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Detalles del pedido */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Detalles del Pedido</h2>

              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b">
                <div>
                  <p className="text-sm text-gray-600">Número de pedido</p>
                  <p className="text-lg font-bold text-gray-900">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha</p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(order.fecha).toLocaleDateString('es-UY')}
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-4">Productos</h3>
              <div className="space-y-3 mb-6 pb-6 border-b">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-gray-700">
                    <div>
                      <p className="font-semibold">{item.nombre}</p>
                      <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
                    </div>
                    <p className="font-semibold">${(item.pvp * item.cantidad).toLocaleString('es-UY')}</p>
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-4">Datos de entrega</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p><strong>Nombre:</strong> {order.cliente.nombre}</p>
                <p><strong>Email:</strong> {order.cliente.email}</p>
                <p><strong>Teléfono:</strong> {order.cliente.telefono}</p>
                <p><strong>Dirección:</strong> {order.cliente.direccion}, {order.cliente.ciudad}</p>
              </div>
            </div>

            {/* Método de pago */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Método de Pago</h2>

              {metodo === 'transferencia' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-900 font-semibold mb-2">Transferencia Bancaria</p>
                  <p className="text-blue-800 text-sm">
                    Te enviaremos los datos bancarios al email <strong>{order.cliente.email}</strong> en los próximos minutos.
                  </p>
                  <p className="text-blue-800 text-sm mt-2">
                    Monto a transferir: <strong>${order.total.toLocaleString('es-UY')}</strong>
                  </p>
                </div>
              )}

              {metodo === 'mercadopago' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-900 font-semibold mb-2">Mercado Pago</p>
                  <p className="text-blue-800 text-sm">
                    Serás redirigido a Mercado Pago para completar el pago.
                  </p>
                  <p className="text-blue-800 text-sm mt-2">
                    Podrás pagar con tarjeta de crédito/débito, transferencia, efectivo o cuotas.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24 h-fit">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumen</h2>

              <div className="space-y-3 pb-6 border-b">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">${order.subtotal.toLocaleString('es-UY')}</span>
                </div>

                {order.descuento > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento ({order.cupon})</span>
                    <span className="font-semibold">-${order.descuento.toLocaleString('es-UY')}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-700">
                  <span>Envío</span>
                  <span className="font-semibold">
                    {order.costoEnvio === 0 ? (
                      <span className="text-green-600">GRATIS</span>
                    ) : (
                      `$${order.costoEnvio.toLocaleString('es-UY')}`
                    )}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-2xl font-bold text-gray-900 mt-6">
                <span>Total:</span>
                <span className="text-blue-600">${order.total.toLocaleString('es-UY')}</span>
              </div>

              <div className="mt-6 pt-6 border-t text-center">
                <p className="text-sm text-gray-600 mb-3">
                  Te enviaremos un email con detalles del pedido y seguimiento.
                </p>
                <Link
                  href="/"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition mb-2"
                >
                  Volver a inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

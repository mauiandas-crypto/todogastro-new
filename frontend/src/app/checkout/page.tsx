'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { useRouter } from 'next/navigation'

const SHIPPING_COST = 200
const FREE_SHIPPING_THRESHOLD = 3000

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: 'Montevideo',
  })

  const [metodoPago, setMetodoPago] = useState<'mercadopago' | 'transferencia'>('mercadopago')
  const [cupon, setCupon] = useState('')
  const [descuento, setDescuento] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [validatingCoupon, setValidatingCoupon] = useState(false)
  const [couponError, setCouponError] = useState('')

  const subtotal = getTotalPrice()
  const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD
  const shippingCost = hasFreeShipping ? 0 : SHIPPING_COST
  const totalConDescuento = Math.max(subtotal - descuento, 0)
  const totalFinal = totalConDescuento + shippingCost

  const handleValidateCoupon = async () => {
    if (!cupon.trim()) {
      setCouponError('Ingresa un código')
      return
    }

    setValidatingCoupon(true)
    setCouponError('')

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: cupon, total: subtotal }),
      })

      const resultado = await response.json()

      if (!resultado.valido) {
        setCouponError(resultado.error || 'Cupón inválido')
        setDescuento(0)
        return
      }

      setDescuento(resultado.cupon.descuento)
      setCouponError('')
    } catch (err) {
      setCouponError('Error validando cupón')
    } finally {
      setValidatingCoupon(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.nombre || !formData.email || !formData.telefono || !formData.direccion) {
      setError('Completa todos los campos')
      return
    }

    setLoading(true)

    try {
      const orderId = `order-${Date.now()}`
      const now = new Date()

      const order = {
        id: orderId,
        fecha: now.toISOString(),
        cliente: formData,
        items: items.map((item) => ({
          id: item.id,
          sku: item.sku,
          nombre: item.name,
          pvp: item.price,
          cantidad: item.quantity,
          imagen: item.image,
          subtotal: item.price * item.quantity,
        })),
        subtotal,
        descuento,
        cupon: cupon || null,
        costoEnvio: shippingCost,
        total: totalFinal,
        estado: 'pendiente' as const,
        metodoPago,
        fechaActualizacion: now.toISOString(),
      }

      // Guardar orden
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      })

      if (!orderResponse.ok) {
        throw new Error('Error al crear la orden')
      }

      // Enviar email de confirmación
      fetch('/api/emails/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          orden: {
            id: orderId,
            fecha: now.toISOString(),
            cliente: formData,
            items: items,
            shippingCost,
            discount: descuento,
            total: totalFinal,
            metodoPago,
          },
        }),
      }).catch((err) => console.error('Error sending email:', err))

      // Si es Mercado Pago, crear preference
      if (metodoPago === 'mercadopago') {
        const mpResponse = await fetch('/api/payments/create-preference', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: [
              ...items.map((item) => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
              })),
              ...(descuento > 0
                ? [{
                    name: `Descuento (${cupon})`,
                    quantity: 1,
                    price: -descuento,
                  }]
                : []),
              ...(shippingCost > 0
                ? [{
                    name: 'Envío',
                    quantity: 1,
                    price: shippingCost,
                  }]
                : []),
            ],
            email: formData.email,
            orderId: orderId,
          }),
        })

        const mpData = await mpResponse.json()
        if (mpData.init_point) {
          window.location.href = mpData.init_point
          return
        }
      }

      // Si es transferencia, mostrar confirmación
      clearCart()
      router.push(`/checkout/confirmacion?orderId=${orderId}&metodo=${metodoPago}`)
    } catch (err) {
      setError('Error procesando la orden. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h1>
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            Volver a comprar
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Datos del cliente */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Datos de entrega</h2>

                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Juan Pérez"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="juan@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="+598 99 123 456"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Dirección *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.direccion}
                      onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Av. Principal 123, Apto 4B"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ciudad
                    </label>
                    <select
                      value={formData.ciudad}
                      onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option>Montevideo</option>
                      <option>Canelones</option>
                      <option>San José</option>
                      <option>Maldonado</option>
                      <option>Otro</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Cupón */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">¿Tienes un cupón?</h2>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cupon}
                    onChange={(e) => setCupon(e.target.value.toUpperCase())}
                    placeholder="Código de cupón"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    disabled={validatingCoupon}
                  />
                  <button
                    type="button"
                    onClick={handleValidateCoupon}
                    disabled={validatingCoupon}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
                  >
                    {validatingCoupon ? 'Validando...' : 'Validar'}
                  </button>
                </div>

                {couponError && (
                  <p className="text-red-600 text-sm mt-2">{couponError}</p>
                )}

                {descuento > 0 && (
                  <p className="text-green-600 text-sm mt-2">
                    ✓ Cupón aplicado: ${descuento.toLocaleString()} de descuento
                  </p>
                )}
              </div>

              {/* Método de pago */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Método de pago</h2>

                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-600 transition" style={{ borderColor: metodoPago === 'mercadopago' ? '#0066cc' : '#ccc' }}>
                    <input
                      type="radio"
                      value="mercadopago"
                      checked={metodoPago === 'mercadopago'}
                      onChange={(e) => setMetodoPago(e.target.value as any)}
                      className="w-4 h-4"
                    />
                    <span className="ml-3">
                      <strong>Mercado Pago</strong>
                      <p className="text-xs text-gray-600">Tarjeta, transferencia, efectivo - Hasta 12 cuotas sin interés</p>
                    </span>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-600 transition" style={{ borderColor: metodoPago === 'transferencia' ? '#0066cc' : '#ccc' }}>
                    <input
                      type="radio"
                      value="transferencia"
                      checked={metodoPago === 'transferencia'}
                      onChange={(e) => setMetodoPago(e.target.value as any)}
                      className="w-4 h-4"
                    />
                    <span className="ml-3">
                      <strong>Transferencia bancaria</strong>
                      <p className="text-xs text-gray-600">Recibirás los datos al confirmar tu pedido</p>
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Procesando...' : `Confirmar Orden - $${totalFinal.toLocaleString()}`}
              </button>
            </form>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24 h-fit">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumen</h2>

              <div className="space-y-2 max-h-48 overflow-y-auto mb-6 pb-6 border-b">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-700">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-semibold">
                      {item.currency} {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toLocaleString()}</span>
                </div>

                {descuento > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento</span>
                    <span className="font-semibold">-${descuento.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-700">
                  <span>Envío</span>
                  {hasFreeShipping ? (
                    <span className="text-green-600 font-semibold">GRATIS</span>
                  ) : (
                    <span className="font-semibold">${shippingCost.toLocaleString()}</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between mb-6 text-2xl">
                <span className="font-bold text-gray-900">Total:</span>
                <span className="font-bold text-blue-600">${totalFinal.toLocaleString()}</span>
              </div>

              <p className="text-xs text-gray-600 text-center">
                ✓ Compra 100% segura
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

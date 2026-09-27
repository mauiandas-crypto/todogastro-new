'use client'

import { useCartStore } from '@/store/cartStore'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const SHIPPING_COST = 200
const FREE_SHIPPING_THRESHOLD = 3000

export default function CarritoPage() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const clearCart = useCartStore((state) => state.clearCart)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)

  const subtotal = getTotalPrice()
  const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD
  const shippingCost = hasFreeShipping ? 0 : SHIPPING_COST
  const total = subtotal + shippingCost

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h1>
          <p className="text-gray-600 mb-8">No hay productos en tu carrito. ¡Continúa comprando!</p>
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Tu Carrito</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tabla de productos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Producto</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Precio</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Cantidad</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Subtotal</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="flex gap-3">
                            {item.image && (
                              <div className="relative w-16 h-16 flex-shrink-0">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                              <p className="text-xs text-gray-500">{item.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 font-semibold text-gray-900">
                          {item.currency} {item.price.toLocaleString()}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 w-fit">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="w-8 h-8 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded text-sm font-bold transition"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded text-sm font-bold transition"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4 font-bold text-gray-900">
                          {item.currency} {(item.price * item.quantity).toLocaleString()}
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700 font-semibold text-sm transition"
                          >
                            Remover
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-gray-50 border-t flex justify-between">
                <button
                  onClick={() => clearCart()}
                  className="text-red-600 hover:text-red-700 font-bold transition text-sm"
                >
                  Limpiar carrito
                </button>
                <Link
                  href="/"
                  className="text-blue-600 hover:text-blue-700 font-bold transition text-sm"
                >
                  Seguir comprando
                </Link>
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24 h-fit">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumen</h2>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-semibold">${subtotal.toLocaleString()}</span>
                </div>
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
                <span className="font-bold text-blue-600">${total.toLocaleString()}</span>
              </div>

              <Link
                href="/checkout"
                className="w-full block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-center transition mb-3"
              >
                Ir a Pagar
              </Link>

              <button
                onClick={() => router.push('/')}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-2 px-4 rounded-lg transition"
              >
                Seguir Comprando
              </button>

              <p className="text-xs text-gray-600 text-center mt-4">
                ✓ Envío a todo Uruguay
              </p>
              <p className="text-xs text-gray-600 text-center">
                ✓ Hasta 12 cuotas sin interés
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

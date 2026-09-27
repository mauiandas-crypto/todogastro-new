'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Cupon {
  code: string
  description: string
  discountType: 'percentage' | 'fixed'
  discount: number
  minPurchase: number
  maxUses: number
  usedCount: number
  active: boolean
  expiresAt: string
}

export default function AdminCuponesPage() {
  const [coupons, setCoupons] = useState<Cupon[]>([
    {
      code: 'BIENVENIDA10',
      description: '10% descuento en primera compra',
      discountType: 'percentage',
      discount: 10,
      minPurchase: 0,
      maxUses: 9999,
      usedCount: 45,
      active: true,
      expiresAt: '2026-12-31',
    },
    {
      code: 'ENVIOGRATIS',
      description: 'Envío gratis en compras mayores a $1000',
      discountType: 'fixed',
      discount: 200,
      minPurchase: 1000,
      maxUses: 9999,
      usedCount: 120,
      active: true,
      expiresAt: '2026-12-31',
    },
    {
      code: 'VERANO20',
      description: '20% en compras mayores a $2000',
      discountType: 'percentage',
      discount: 20,
      minPurchase: 2000,
      maxUses: 9999,
      usedCount: 32,
      active: true,
      expiresAt: '2026-12-31',
    },
  ])

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as const,
    discount: 0,
    minPurchase: 0,
    maxUses: 9999,
    active: true,
    expiresAt: '2026-12-31',
  })

  const addCoupon = () => {
    if (!newCoupon.code) return
    setCoupons([...coupons, { ...newCoupon, usedCount: 0 }])
    setNewCoupon({
      code: '',
      description: '',
      discountType: 'percentage',
      discount: 0,
      minPurchase: 0,
      maxUses: 9999,
      active: true,
      expiresAt: '2026-12-31',
    })
  }

  const toggleActive = (code: string) => {
    setCoupons(coupons.map(c => c.code === code ? { ...c, active: !c.active } : c))
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <Link href="/admin" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Volver a Admin
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Gestión de Cupones</h1>

        {/* Crear nuevo cupón */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Crear Nuevo Cupón</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Código"
              value={newCoupon.code}
              onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="text"
              placeholder="Descripción"
              value={newCoupon.description}
              onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <select
              value={newCoupon.discountType}
              onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value as any })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="percentage">Porcentaje (%)</option>
              <option value="fixed">Cantidad ($)</option>
            </select>
            <input
              type="number"
              placeholder="Descuento"
              value={newCoupon.discount}
              onChange={(e) => setNewCoupon({ ...newCoupon, discount: parseFloat(e.target.value) })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="number"
              placeholder="Monto mínimo"
              value={newCoupon.minPurchase}
              onChange={(e) => setNewCoupon({ ...newCoupon, minPurchase: parseFloat(e.target.value) })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="date"
              value={newCoupon.expiresAt}
              onChange={(e) => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            onClick={addCoupon}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            Crear Cupón
          </button>
        </div>

        {/* Tabla de cupones */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-bold">Código</th>
                <th className="px-6 py-3 text-left font-bold">Descripción</th>
                <th className="px-6 py-3 text-left font-bold">Descuento</th>
                <th className="px-6 py-3 text-left font-bold">Mín.</th>
                <th className="px-6 py-3 text-left font-bold">Usos</th>
                <th className="px-6 py-3 text-left font-bold">Vence</th>
                <th className="px-6 py-3 text-left font-bold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.code} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3 font-bold">{coupon.code}</td>
                  <td className="px-6 py-3">{coupon.description}</td>
                  <td className="px-6 py-3">
                    {coupon.discountType === 'percentage' ? `${coupon.discount}%` : `$${coupon.discount}`}
                  </td>
                  <td className="px-6 py-3">${coupon.minPurchase}</td>
                  <td className="px-6 py-3">{coupon.usedCount}/{coupon.maxUses}</td>
                  <td className="px-6 py-3">{coupon.expiresAt}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => toggleActive(coupon.code)}
                      className={`px-3 py-1 rounded font-bold text-sm ${
                        coupon.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {coupon.active ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

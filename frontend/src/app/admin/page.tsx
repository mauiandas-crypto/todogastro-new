'use client'

import Link from 'next/link'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Panel Admin</h1>
        <p className="text-gray-600 mb-8">Gestión de TodoGastro</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Cupones */}
          <Link href="/admin/cupones" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-2">🎟️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cupones</h2>
            <p className="text-gray-600">Gestionar códigos de descuento y promociones</p>
            <p className="text-blue-600 font-bold mt-4">→ Ir a Cupones</p>
          </Link>

          {/* Órdenes */}
          <Link href="/admin/ordenes" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-2">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Órdenes</h2>
            <p className="text-gray-600">Ver y gestionar todos los pedidos</p>
            <p className="text-blue-600 font-bold mt-4">→ Ir a Órdenes</p>
          </Link>

          {/* Configuración */}
          <div className="bg-white rounded-lg shadow-lg p-6 opacity-50 cursor-not-allowed">
            <div className="text-4xl mb-2">⚙️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Configuración</h2>
            <p className="text-gray-600">Próximamente</p>
            <p className="text-gray-400 font-bold mt-4">→ Coming soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}

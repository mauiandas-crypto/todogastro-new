'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [accepted, setAccepted] = useState(true)

  useEffect(() => {
    const cookieAccepted = localStorage.getItem('todogastro-cookies-accepted')
    setAccepted(!!cookieAccepted)
  }, [])

  if (accepted) return null

  const handleAccept = () => {
    localStorage.setItem('todogastro-cookies-accepted', 'true')
    setAccepted(true)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4 z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm flex-1">
          <p className="font-semibold mb-1">🍪 Usamos cookies</p>
          <p className="text-gray-300">Utilizamos cookies para mejorar tu experiencia, personalizar contenido y analizar tráfico. Al continuar, aceptas nuestro uso de cookies. Lee nuestra <Link href="/privacidad" className="underline hover:text-gray-100">política de privacidad</Link>.</p>
        </div>
        <div className="flex gap-2 whitespace-nowrap">
          <button
            onClick={handleAccept}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}

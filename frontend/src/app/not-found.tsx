import Link from 'next/link'

export const metadata = {
  title: '404 - Página no encontrada',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-black text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Página no encontrada</h2>
        <p className="text-gray-600 mb-8 max-w-md">La página que buscas no existe. Tal vez fue removida o la URL es incorrecta.</p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/"
            className="px-6 py-3 bg-black text-white font-bold hover:bg-gray-800 transition"
          >
            Ir a Inicio
          </Link>
          <Link
            href="/catalogo"
            className="px-6 py-3 border-2 border-black font-bold hover:bg-black hover:text-white transition"
          >
            Ver Catálogo
          </Link>
        </div>
      </div>
    </div>
  )
}

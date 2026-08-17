'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const CATEGORIAS = [
  {
    nombre: 'Cocción',
    subcategorias: ['Cocinas y hornos', 'Freidoras', 'Anafes', 'Planchas', 'Parrillas']
  },
  {
    nombre: 'Elaboración',
    subcategorias: ['Amasadoras', 'Picadoras', 'Cortadoras', 'Procesadoras', 'Dulces']
  },
  {
    nombre: 'Refrigeración',
    subcategorias: ['Vitrinas', 'Freezers', 'Heladeras', 'Cámaras', 'Abatidores']
  },
  {
    nombre: 'Equipamiento',
    subcategorias: ['Mesadas', 'Cafeteras', 'Accesorios', 'Complementos']
  }
];

export default function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [categoriasHover, setCategoriasHover] = useState<string | null>(null);

  return (
    <>
      {/* Barra fija de info */}
      <div className="bg-black text-white text-xs py-2 text-center border-b-2 border-black hidden sm:block">
        <span className="inline-block mx-4">📍 Aguada, Montevideo</span>
        <span className="inline-block mx-4">🕐 Lunes a Viernes 8:30-17:15</span>
        <a href="https://wa.me/598927155555" className="inline-block mx-4 hover:text-gray-300">
          📞 +598 92715555
        </a>
      </div>

      {/* Header principal */}
      <header className="bg-white border-b-2 border-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo SVG Real */}
            <Link href="/" className="flex-shrink-0 h-12">
              <img src="/logo.svg" alt="TodoGastro" className="h-full w-auto" />
            </Link>

            {/* Buscador */}
            <div className="hidden sm:flex flex-1 max-w-xs">
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full px-4 py-2 border-2 border-black focus:outline-none focus:bg-gray-50"
              />
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-4 sm:gap-6">
              <a
                href="https://wa.me/598927155555"
                className="hidden sm:block px-4 py-2 bg-black text-white font-bold text-sm hover:bg-gray-800"
              >
                💬 WhatsApp
              </a>

              <Link href="/carrito" className="text-2xl hover:opacity-60">
                🛒
              </Link>

              <Link href="/login" className="hidden sm:block text-sm font-bold hover:underline">
                Ingresar
              </Link>

              <button
                onClick={() => setMenuAbierto(!menuAbierto)}
                className="sm:hidden text-2xl font-bold"
              >
                ☰
              </button>
            </div>
          </div>

          {/* Mega-menú desktop */}
          <nav className="hidden sm:flex gap-8 mt-4 border-t-2 border-black pt-3">
            {CATEGORIAS.map((cat) => (
              <div
                key={cat.nombre}
                className="relative group"
                onMouseEnter={() => setCategoriasHover(cat.nombre)}
                onMouseLeave={() => setCategoriasHover(null)}
              >
                <button className="font-bold text-sm hover:underline text-gray-900">
                  {cat.nombre}
                </button>

                {/* Submenu */}
                {categoriasHover === cat.nombre && (
                  <div className="absolute top-full left-0 bg-white border-2 border-black shadow-lg z-50 min-w-max">
                    {cat.subcategorias.map((sub, i) => (
                      <Link
                        key={sub}
                        href={`/categoria/${sub.toLowerCase().replace(/ /g, '-')}`}
                        className={`block px-4 py-2 hover:bg-black hover:text-white text-sm font-medium text-gray-900 ${
                          i < cat.subcategorias.length - 1 ? 'border-b border-gray-200' : ''
                        }`}
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link href="/descuentos" className="font-bold text-sm hover:underline text-red-700">
              🔥 DESCUENTOS
            </Link>
          </nav>

          {/* Menú mobile */}
          {menuAbierto && (
            <nav className="sm:hidden mt-4 border-t-2 border-black pt-3 pb-3 space-y-4">
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full px-4 py-2 border-2 border-black focus:outline-none text-gray-900"
              />
              {CATEGORIAS.map((cat) => (
                <div key={cat.nombre}>
                  <h3 className="font-bold text-sm mb-2 text-gray-900">{cat.nombre}</h3>
                  <div className="ml-4 space-y-1">
                    {cat.subcategorias.map((sub) => (
                      <Link
                        key={sub}
                        href={`/categoria/${sub.toLowerCase().replace(/ /g, '-')}`}
                        className="block text-xs hover:underline text-gray-900"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <Link href="/descuentos" className="block font-bold text-sm text-red-700">
                🔥 DESCUENTOS
              </Link>
              <div className="pt-3 border-t border-gray-300">
                <Link href="/login" className="block text-sm font-bold mb-2 text-gray-900">
                  Ingresar
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>
    </>
  );
}

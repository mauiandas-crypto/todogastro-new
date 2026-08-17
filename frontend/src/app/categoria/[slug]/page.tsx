'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  precioAnterior?: number;
  moneda: string;
  stock: number;
  imagenes: string[];
  slug: string;
}

export default function PaginaCategoria({ params }: { params: { slug: string } }) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://todogastro-new-production.up.railway.app';
        const response = await fetch(
          `${apiUrl}/api/products?categoria=${decodeURIComponent(params.slug)}&limit=100`,
          { mode: 'cors' }
        );
        if (response.ok) {
          const data = await response.json();
          setProductos(data.products || []);
        }
      } catch (error) {
        console.error('Error cargando categoría:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarProductos();
  }, [params.slug]);

  const nombreCategoria = decodeURIComponent(params.slug)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="bg-white min-h-screen">
      {/* Header categoría */}
      <div className="bg-gray-50 border-b-2 border-black px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-black mb-2">{nombreCategoria}</h1>
          <p className="text-gray-600">{productos.length} productos disponibles</p>
        </div>
      </div>

      {/* Productos */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">Cargando productos...</div>
        ) : productos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productos.map((p) => (
              <Link
                key={p.id}
                href={`/producto/${p.slug}`}
                className="border-2 border-black hover:shadow-lg transition group"
              >
                <div className="aspect-square bg-gray-100 overflow-hidden flex items-center justify-center">
                  {p.imagenes[0] ? (
                    <Image
                      src={p.imagenes[0]}
                      alt={p.nombre}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  ) : (
                    <span className="text-gray-400 font-bold">Sin imagen</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm line-clamp-2 mb-2">{p.nombre}</h3>
                  <div className="flex justify-between items-end">
                    <div>
                      {p.precioAnterior && (
                        <span className="text-xs line-through text-gray-500 block">
                          {p.moneda} {p.precioAnterior.toLocaleString()}
                        </span>
                      )}
                      <span className="text-2xl font-black">{p.moneda} {p.precio.toLocaleString()}</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 ${p.stock > 0 ? 'bg-black text-white' : 'bg-gray-300'}`}>
                      {p.stock > 0 ? 'STOCK' : 'AGOTADO'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No hay productos en esta categoría</p>
          </div>
        )}
      </div>
    </div>
  );
}

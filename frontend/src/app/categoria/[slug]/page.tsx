'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Producto {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  in_stock: boolean;
  stock_quantity?: number;
  images: Array<{ src: string; alt: string }>;
  url: string;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default function PaginaCategoria({ params }: Props) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const resolvedParams = await params;
      if (mounted) {
        setSlug(resolvedParams.slug);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    const cargarProductos = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://todogastro-new-production.up.railway.app';
        const url = `${apiUrl}/api/products?category=${decodeURIComponent(slug)}&limit=100`;
        console.log('Fetching category:', url);

        const response = await fetch(url, { mode: 'cors' });
        console.log('Response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('Category data:', data);
          setProductos(Array.isArray(data.products) ? data.products : []);
        }
      } catch (error) {
        console.error('Error cargando categoría:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarProductos();
  }, [slug]);

  const nombreCategoria = slug
    ? decodeURIComponent(slug)
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase())
    : 'Categoría';

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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {productos.map((p) => {
              const imageSrc = p.images?.[0]?.src || '';
              const imageAlt = p.images?.[0]?.alt || p.name;
              return (
              <Link
                key={p.id}
                href={`/producto/${p.id}`}
                className="border-2 border-black hover:shadow-lg transition group"
              >
                <div className="aspect-square bg-gray-100 overflow-hidden flex items-center justify-center">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={imageAlt}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  ) : (
                    <span className="text-gray-400 font-bold text-xs">Sin imagen</span>
                  )}
                </div>
                <div className="p-2">
                  <h3 className="font-bold text-xs line-clamp-2 mb-1">{p.name}</h3>
                  <div className="flex justify-between items-end gap-1">
                    <div>
                      <span className="text-sm font-black">{p.currency} {p.price.toLocaleString()}</span>
                    </div>
                    <span className={`text-xs font-bold px-1 py-0.5 ${p.in_stock ? 'bg-black text-white' : 'bg-gray-300'}`}>
                      {p.in_stock ? 'STOCK' : 'AGOTADO'}
                    </span>
                  </div>
                </div>
              </Link>
            );
            })}
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

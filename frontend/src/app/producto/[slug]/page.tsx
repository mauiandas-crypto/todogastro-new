'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import GaleriaProducto from '@/components/GaleriaProducto';

interface Producto {
  id: string;
  sku: string;
  name: string;
  category: string;
  categories?: string[];
  description: string;
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

export default function PaginaProducto({ params }: Props) {
  const [producto, setProducto] = useState<Producto | null>(null);
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
    const cargarProducto = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://todogastro-new-production.up.railway.app';
        const url = `${apiUrl}/api/products/${slug}`;
        console.log('Fetching product:', url);

        const response = await fetch(url, { mode: 'cors' });
        console.log('Response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('Product data:', data);
          setProducto(data.product || data);
        }
      } catch (error) {
        console.error('Error cargando producto:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarProducto();
  }, [slug]);

  if (loading) return <div className="text-center py-12">Cargando...</div>;
  if (!producto) return <div className="text-center py-12">Producto no encontrado</div>;

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4 border-b border-gray-200">
        <Link href="/" className="hover:underline">Inicio</Link>
        {' > '}
        {producto.category && (
          <>
            <Link href={`/categoria/${producto.category.toLowerCase()}`} className="hover:underline">
              {producto.category}
            </Link>
            {' > '}
          </>
        )}
        <span className="font-bold">{producto.name}</span>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Galería */}
          <div>
            {producto?.images ? (
              <GaleriaProducto imagenes={producto.images} nombre={producto.name} />
            ) : (
              <div className="bg-gray-100 border-2 border-black w-full aspect-square flex items-center justify-center">
                <span className="text-gray-500 font-bold">Sin imagen</span>
              </div>
            )}
          </div>

          {/* Info del producto */}
          <div>
            <h1 className="text-3xl font-black mb-2">{producto.name}</h1>
            <p className="text-gray-600 mb-4 text-sm">SKU: {producto.sku}</p>

            {/* Precio */}
            <div className="border-2 border-black p-4 mb-6">
              <p className="text-4xl font-black mb-2">
                {producto.currency} {producto.price.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">IVA incluido</p>
            </div>

            {/* Stock */}
            <div className={`p-3 mb-6 font-bold text-sm ${
              producto.in_stock ? 'bg-black text-white' : 'bg-gray-300 text-black'
            }`}>
              {producto.in_stock ? `✓ EN STOCK` : 'AGOTADO'}
            </div>

            {/* Botones */}
            <div className="space-y-3 mb-8">
              <button className="w-full bg-black text-white py-3 font-bold hover:bg-gray-800">
                🛒 AGREGAR AL CARRITO
              </button>
              <a
                href={`https://wa.me/598927155555?text=Me interesa el producto: ${producto.name}`}
                target="_blank"
                className="w-full block text-center bg-white border-2 border-black py-3 font-bold hover:bg-black hover:text-white transition"
              >
                💬 CONSULTAR POR WHATSAPP
              </a>
            </div>

            {/* Descripción técnica */}
            <div className="border-2 border-black p-4">
              <h3 className="font-bold mb-3">ESPECIFICACIONES TÉCNICAS</h3>
              <div className="text-sm space-y-2 text-gray-700 whitespace-pre-line">
                {producto.description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

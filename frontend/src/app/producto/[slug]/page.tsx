'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import GaleriaProducto from '@/components/GaleriaProducto';

interface Producto {
  id: string;
  sku: string;
  nombre: string;
  categoria: string;
  subcategoria: string;
  descripcion: string;
  precio: number;
  precioAnterior?: number;
  moneda: string;
  stock: number;
  imagenes: string[];
}

export default function PaginaProducto({ params }: { params: { slug: string } }) {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://todogastro-new-production.up.railway.app';
        const response = await fetch(`${apiUrl}/api/products/${params.slug}`, { mode: 'cors' });
        if (response.ok) {
          const data = await response.json();
          setProducto(data);
        }
      } catch (error) {
        console.error('Error cargando producto:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarProducto();
  }, [params.slug]);

  if (loading) return <div className="text-center py-12">Cargando...</div>;
  if (!producto) return <div className="text-center py-12">Producto no encontrado</div>;

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4 border-b border-gray-200">
        <Link href="/" className="hover:underline">Inicio</Link>
        {' > '}
        <Link href={`/categoria/${producto.categoria.toLowerCase()}`} className="hover:underline">
          {producto.categoria}
        </Link>
        {' > '}
        <span className="font-bold">{producto.nombre}</span>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Galería */}
          <div>
            <GaleriaProducto imagenes={producto.imagenes} nombre={producto.nombre} />
          </div>

          {/* Info del producto */}
          <div>
            <h1 className="text-3xl font-black mb-2">{producto.nombre}</h1>
            <p className="text-gray-600 mb-4 text-sm">SKU: {producto.sku}</p>

            {/* Precio */}
            <div className="border-2 border-black p-4 mb-6">
              {producto.precioAnterior && (
                <p className="text-sm line-through text-gray-500 mb-1">
                  {producto.moneda} {producto.precioAnterior.toLocaleString()}
                </p>
              )}
              <p className="text-4xl font-black mb-2">
                {producto.moneda} {producto.precio.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">IVA incluido</p>
            </div>

            {/* Stock */}
            <div className={`p-3 mb-6 font-bold text-sm ${
              producto.stock > 0 ? 'bg-black text-white' : 'bg-gray-300 text-black'
            }`}>
              {producto.stock > 0 ? `✓ EN STOCK (${producto.stock} unidades)` : 'AGOTADO'}
            </div>

            {/* Botones */}
            <div className="space-y-3 mb-8">
              <button className="w-full bg-black text-white py-3 font-bold hover:bg-gray-800">
                🛒 AGREGAR AL CARRITO
              </button>
              <a
                href={`https://wa.me/598927155555?text=Me interesa el producto: ${producto.nombre}`}
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
                {producto.descripcion}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

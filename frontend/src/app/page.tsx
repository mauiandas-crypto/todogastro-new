'use client';

import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  short_description: string;
  in_stock: boolean;
  images?: Array<{ src: string; alt: string }>;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeaturedProducts = useCallback(async () => {
    try {
      const response = await fetch(
        'http://localhost:3001/api/products?limit=6&page=1',
        { mode: 'cors' }
      );
      if (response.ok) {
        const data = await response.json();
        setFeaturedProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // En desarrollo, mostrar productos dummy
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch featured products from API
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            TodoGastro - Equipamiento Gastronómico
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Los mejores productos para tu negocio de comidas y bebidas.
            Equipamiento profesional con garantía y calidad asegurada.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/catalog"
              className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition"
            >
              Ver Catálogo
            </Link>
            <Link
              href="#"
              className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition"
            >
              Contactar
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold mb-4 text-center">Productos Destacados</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-12">
            Descubre nuestra selección de equipamiento gastronómico
          </p>

          {loading ? (
            <div className="text-center py-12">
              <p>Cargando productos...</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/catalog/${product.id}`}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
                >
                  <div className="h-48 bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0].src}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">Sin imagen</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {product.short_description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-blue-600">
                        {product.currency} {product.price.toLocaleString()}
                      </span>
                      <span
                        className={`text-sm font-semibold px-3 py-1 rounded-full ${
                          product.in_stock
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {product.in_stock ? 'En Stock' : 'Agotado'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No pudimos cargar los productos. Por favor intenta más tarde.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Nota: Asegúrate que el backend esté corriendo en http://localhost:3001
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/catalog"
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition inline-block"
            >
              Ver Todos los Productos →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-2">Productos Verificados</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Todos nuestros productos pasan por control de calidad
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-bold mb-2">Envíos Rápidos</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Entrega en 24-48 horas en Montevideo
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-bold mb-2">Múltiples Formas de Pago</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tarjetas, transferencias y MercadoPago
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

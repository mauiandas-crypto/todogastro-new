'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

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

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  // Force rebuild 2

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://todogastro-new-production.up.railway.app';
        const url = `${apiUrl}/api/products?limit=20`;
        console.log('Fetching from:', url);

        const response = await fetch(url, { mode: 'cors' });
        console.log('Response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('Data received:', data);
          setProductos(Array.isArray(data.products) ? data.products : []);
        } else {
          console.error('API responded with status:', response.status);
        }
      } catch (error) {
        console.error('Error cargando productos:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarProductos();
  }, []);

  return (
    <div className="bg-white">
      {/* 1. SLIDER PRINCIPAL (Banners) */}
      <section className="bg-black text-white py-24 px-4 text-center">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
            EQUIPAMIENTO GASTRONÓMICO PROFESIONAL
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light">
            Cocinas, refrigeración, elaboración. Todo para tu negocio.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/catalogo" className="px-6 py-3 bg-white text-black font-bold hover:bg-gray-200">
              VER CATÁLOGO
            </Link>
            <a href="https://wa.me/598927155555" className="px-6 py-3 border-2 border-white font-bold hover:bg-white/10">
              COTIZAR POR WHATSAPP
            </a>
          </div>
        </div>
      </section>

      {/* 2. ACCESOS RÁPIDOS POR CATEGORÍA */}
      <section className="border-b-2 border-black px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {['Cocción', 'Elaboración', 'Refrigeración', 'Equipamiento', 'Descuentos'].map((cat) => (
              <Link
                key={cat}
                href={`/categoria/${cat.toLowerCase()}`}
                className="border-2 border-black p-4 text-center hover:bg-black hover:text-white transition"
              >
                <div className="text-3xl mb-2">📦</div>
                <h3 className="font-bold text-sm text-gray-900">{cat}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. DESTACADOS */}
      {!loading && productos.length > 0 && (
        <section className="border-b-2 border-black px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-black mb-2 text-gray-900">PRODUCTOS DESTACADOS</h2>
            <p className="text-gray-900 mb-8 font-light">Los más buscados en equipamiento gastronómico</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productos.slice(0, 6).map((p) => {
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
                        width={300}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <span className="text-gray-400 font-bold">Sin imagen</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm line-clamp-2 mb-2 text-gray-900">{p.name}</h3>
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-2xl font-black text-gray-900">{p.currency} {p.price.toLocaleString()}</span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 ${p.in_stock ? 'bg-black text-white' : 'bg-gray-300'}`}>
                        {p.in_stock ? 'STOCK' : 'AGOTADO'}
                      </span>
                    </div>
                  </div>
                </Link>
              );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4. BLOQUES TEMÁTICOS POR CATEGORÍA */}
      <section className="border-b-2 border-black px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {['Cocción', 'Refrigeración', 'Elaboración'].map((cat) => (
            <div key={cat} className="mb-12 last:mb-0">
              <h3 className="text-2xl font-black mb-4 text-gray-900">
                {cat.toUpperCase()} desde USD <span className="text-3xl">$</span>
              </h3>
              <p className="text-gray-900 text-sm mb-6">Equipamiento profesional {cat.toLowerCase()} para tu negocio</p>
              <Link href={`/categoria/${cat.toLowerCase()}`} className="px-6 py-3 border-2 border-black font-bold hover:bg-black hover:text-white transition">
                VER {cat.toUpperCase()} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 5. BLOQUE INSTITUCIONAL */}
      <section className="bg-gray-50 border-b-2 border-black px-4 py-12">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4 text-gray-900">SOMOS TODOGASTRO</h2>
          <p className="text-lg mb-6 font-light max-w-2xl mx-auto text-gray-900">
            Desde Aguada, Montevideo. Más de 20 años equipando bares, restaurantes, panaderías y hoteles con equipamiento profesional de calidad.
          </p>
          <div className="flex gap-8 justify-center flex-wrap text-sm font-bold text-gray-900">
            <div>📍 Aguada, Montevideo</div>
            <div>🕐 Lun-Vie 8:30-17:15</div>
            <div>📞 +598 92715555</div>
          </div>
        </div>
      </section>

      {/* 6. NEWSLETTER */}
      <section className="border-b-2 border-black px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-black mb-4 text-gray-900">RECIBÍ NOVEDADES Y DESCUENTOS</h2>
          <form className="flex gap-2">
            <input type="email" placeholder="Tu email..." className="flex-1 px-4 py-3 border-2 border-black focus:outline-none text-gray-900" required />
            <button type="submit" className="px-6 py-3 bg-black text-white font-bold hover:bg-gray-800">
              SUSCRIBIR
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}

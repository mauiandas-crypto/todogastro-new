'use client';

import { useState } from 'react';
import Image from 'next/image';

interface GaleriaProductoProps {
  imagenes?: Array<{ src: string; alt: string }> | null;
  nombre: string;
}

export default function GaleriaProducto({ imagenes, nombre }: GaleriaProductoProps) {
  const [imagenActual, setImagenActual] = useState(0);
  const [zoomActivo, setZoomActivo] = useState(false);

  const imgs = Array.isArray(imagenes) ? imagenes : [];

  if (imgs.length === 0) {
    return (
      <div className="bg-gray-100 border-2 border-black w-full aspect-square flex items-center justify-center">
        <span className="text-gray-500 font-bold">Sin imagen disponible</span>
      </div>
    );
  }

  const imagenUrl = imgs[imagenActual]?.src || '';

  return (
    <div className="space-y-4">
      {/* Imagen principal con zoom */}
      <div
        className="bg-gray-50 border-2 border-black overflow-hidden cursor-zoom-in aspect-square"
        onMouseEnter={() => setZoomActivo(true)}
        onMouseLeave={() => setZoomActivo(false)}
      >
        <Image
          src={imagenUrl}
          alt={`${nombre} - Imagen ${imagenActual + 1}`}
          width={500}
          height={500}
          className={`w-full h-full object-cover transition-transform ${
            zoomActivo ? 'scale-150' : 'scale-100'
          }`}
          priority={imagenActual === 0}
        />

        {/* Controles de navegación */}
        {imgs.length > 1 && (
          <>
            {/* Flechas */}
            <button
              onClick={() => setImagenActual((prev) => (prev === 0 ? imgs.length - 1 : prev - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black text-white px-3 py-2 font-bold hover:bg-gray-800 z-10"
              aria-label="Imagen anterior"
            >
              ◀
            </button>

            <button
              onClick={() => setImagenActual((prev) => (prev === imgs.length - 1 ? 0 : prev + 1))}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white px-3 py-2 font-bold hover:bg-gray-800 z-10"
              aria-label="Imagen siguiente"
            >
              ▶
            </button>

            {/* Indicadores de posición */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {imgs.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setImagenActual(idx)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === imagenActual ? 'bg-black' : 'bg-gray-400'
                  }`}
                  aria-label={`Ver imagen ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {imgs.length > 1 && (
        <div className="grid grid-cols-6 gap-2 sm:gap-3">
          {imgs.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setImagenActual(idx)}
              className={`relative aspect-square border-2 overflow-hidden hover:opacity-75 transition-opacity ${
                idx === imagenActual ? 'border-black' : 'border-gray-300'
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt || `${nombre} - Miniatura ${idx + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Contador */}
      {imgs.length > 1 && (
        <div className="text-center text-xs text-gray-600 font-bold">
          {imagenActual + 1} de {imgs.length}
        </div>
      )}
    </div>
  );
}

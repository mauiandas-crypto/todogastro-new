'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Sobre nosotros */}
          <div>
            <h3 className="font-bold text-lg mb-4">TODOGASTRO</h3>
            <p className="text-sm text-gray-400 mb-4">
              Más de 20 años equipando bares, restaurantes y hoteles con profesionalismo.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div>📍 Aguada, Montevideo</div>
              <div>🕐 Lun-Vie 8:30-17:15</div>
            </div>
          </div>

          {/* Enlaces */}
          <div>
            <h4 className="text-white font-bold mb-4">ENLACES</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-white transition">Inicio</Link></li>
              <li><Link href="/catalogo" className="hover:text-white transition">Catálogo</Link></li>
              <li><Link href="/carrito" className="hover:text-white transition">Carrito</Link></li>
              <li><Link href="/admin" className="hover:text-white transition">Admin</Link></li>
            </ul>
          </div>

          {/* Categorías */}
          <div>
            <h4 className="text-white font-bold mb-4">CATEGORÍAS</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/categoria/coccion" className="hover:text-white transition">Cocción</Link></li>
              <li><Link href="/categoria/refrigeracion" className="hover:text-white transition">Refrigeración</Link></li>
              <li><Link href="/categoria/elaboracion" className="hover:text-white transition">Elaboración</Link></li>
              <li><Link href="/categoria/equipamiento" className="hover:text-white transition">Equipamiento</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-white font-bold mb-4">CONTACTO</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div>
                <span className="block font-semibold text-white">Teléfono</span>
                <a href="tel:+59892715555" className="hover:text-white transition">+598 92715555</a>
              </div>
              <div>
                <span className="block font-semibold text-white">WhatsApp</span>
                <a href="https://wa.me/598927155555" className="hover:text-white transition">Contactar por WhatsApp</a>
              </div>
              <div>
                <span className="block font-semibold text-white">Email</span>
                <a href="mailto:info@todogastro.uy" className="hover:text-white transition">info@todogastro.uy</a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; {currentYear} TodoGastro. Todos los derechos reservados.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">Términos y condiciones</a>
              <a href="#" className="hover:text-white transition">Privacidad</a>
              <a href="#" className="hover:text-white transition">Devoluciones</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

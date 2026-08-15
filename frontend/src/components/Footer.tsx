export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">TodoGastro</h3>
            <p className="text-sm">
              Equipamiento gastronómico de calidad para tu negocio.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Productos</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/catalog" className="hover:text-blue-400">Catálogo</a></li>
              <li><a href="/catalog" className="hover:text-blue-400">Promociones</a></li>
              <li><a href="#" className="hover:text-blue-400">Nuevos Productos</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Soporte</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400">Contacto</a></li>
              <li><a href="#" className="hover:text-blue-400">Preguntas Frecuentes</a></li>
              <li><a href="#" className="hover:text-blue-400">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-blue-400">Política de Privacidad</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contacto</h4>
            <p className="text-sm mb-2">📧 info@todogastro.com.uy</p>
            <p className="text-sm mb-2">📞 +598 2 XXXX XXXX</p>
            <p className="text-sm">📍 Montevideo, Uruguay</p>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-700" />

        {/* Copyright */}
        <div className="mt-8 text-center text-sm">
          <p>&copy; {currentYear} TodoGastro. Todos los derechos reservados.</p>
          <p className="mt-2 text-xs">Powered by NextJS + Cloudflare Pages</p>
        </div>
      </div>
    </footer>
  );
}

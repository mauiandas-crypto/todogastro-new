import Link from 'next/link'

export const metadata = {
  title: 'Política de Privacidad - TodoGastro',
  description: 'Política de privacidad de TodoGastro. Cómo protegemos tus datos.',
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">← Volver</Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Política de Privacidad</h1>

        <div className="prose prose-lg text-gray-700 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Información que Recopilamos</h2>
            <p>Recopilamos información personal cuando:</p>
            <ul className="list-disc pl-6">
              <li>Realizas una compra en nuestro sitio</li>
              <li>Te suscribes a nuestro newsletter</li>
              <li>Contactas con nosotros por WhatsApp o email</li>
              <li>Navegas nuestro sitio (mediante cookies)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Cómo Usamos Tu Información</h2>
            <ul className="list-disc pl-6">
              <li>Procesar y entregar tus pedidos</li>
              <li>Enviar confirmaciones y actualizaciones</li>
              <li>Mejorar nuestros productos y servicios</li>
              <li>Enviarte ofertas (si lo autorizas)</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Seguridad de Datos</h2>
            <p>Protegemos tu información con encriptación SSL/TLS. Los pagos se procesan a través de Mercado Pago, que cumple con estándares PCI-DSS.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Cookies</h2>
            <p>Usamos cookies para:</p>
            <ul className="list-disc pl-6">
              <li>Mantener tu sesión de compra</li>
              <li>Recordar tus preferencias</li>
              <li>Analizar el uso del sitio</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Tus Derechos</h2>
            <p>Tienes derecho a:</p>
            <ul className="list-disc pl-6">
              <li>Acceder a tus datos personales</li>
              <li>Solicitar correcciones</li>
              <li>Solicitar la eliminación de datos</li>
              <li>Optar por no recibir marketing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Contacto</h2>
            <p>Para preguntas sobre privacidad, contáctanos en <a href="mailto:info@todogastro.uy" className="text-blue-600 hover:underline">info@todogastro.uy</a></p>
          </section>

          <p className="text-sm text-gray-600 mt-12">Última actualización: Septiembre 2026</p>
        </div>
      </div>
    </div>
  )
}

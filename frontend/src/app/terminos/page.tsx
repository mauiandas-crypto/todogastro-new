import Link from 'next/link'

export const metadata = {
  title: 'Términos y Condiciones - TodoGastro',
  description: 'Términos y condiciones de uso de TodoGastro.',
}

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">← Volver</Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Términos y Condiciones</h1>

        <div className="prose prose-lg text-gray-700 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Aceptación de Términos</h2>
            <p>Al usar todogastro.uy, aceptas estos términos y condiciones. Si no estás de acuerdo, no uses el sitio.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Licencia de Uso</h2>
            <p>Se te otorga una licencia limitada y no exclusiva para usar este sitio para fines de compra legítimos.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Descripción de Productos</h2>
            <p>Hacemos nuestro mejor esfuerzo por describir productos con precisión. Sin embargo, no garantizamos que las descripciones sean exactas o completas.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Precios y Disponibilidad</h2>
            <p>Los precios pueden cambiar sin previo aviso. La disponibilidad de productos está sujeta a cambios. Nos reservamos el derecho de rechazar órdenes.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Proceso de Compra</h2>
            <ul className="list-disc pl-6">
              <li>Debes proporcionar información de contacto y envío válida</li>
              <li>El pago se procesa a través de Mercado Pago o transferencia bancaria</li>
              <li>La confirmación de orden se envía por email</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Envíos</h2>
            <ul className="list-disc pl-6">
              <li>Envío a todo Uruguay: $200 (gratis si subtotal ≥ $3000)</li>
              <li>Tiempo estimado: 2-5 días hábiles</li>
              <li>No somos responsables de daños causados por terceros</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Devoluciones y Reembolsos</h2>
            <p>Los productos pueden devolverse dentro de 30 días si están en condiciones originales. Contacta a info@todogastro.uy para iniciar una devolución.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Limitación de Responsabilidad</h2>
            <p>TodoGastro no será responsable por daños indirectos, incidentales o consecuentes derivados del uso de este sitio o productos.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Cambios en los Términos</h2>
            <p>Podemos actualizar estos términos en cualquier momento. El uso continuado del sitio implica aceptación de cambios.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Contacto</h2>
            <p>Para preguntas sobre estos términos: <a href="mailto:info@todogastro.uy" className="text-blue-600 hover:underline">info@todogastro.uy</a></p>
          </section>

          <p className="text-sm text-gray-600 mt-12">Última actualización: Septiembre 2026</p>
        </div>
      </div>
    </div>
  )
}

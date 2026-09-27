import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, orden } = await request.json()

    if (!email || !orden) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      )
    }

    const itemsHtml = orden.items
      .map(
        (item: any) =>
          `<tr>
          <td style="border-bottom: 1px solid #ddd; padding: 8px;">${item.name}</td>
          <td style="border-bottom: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantity}</td>
          <td style="border-bottom: 1px solid #ddd; padding: 8px; text-align: right;">$${item.price.toLocaleString()}</td>
          <td style="border-bottom: 1px solid #ddd; padding: 8px; text-align: right;">$${(item.price * item.quantity).toLocaleString()}</td>
        </tr>`
      )
      .join('')

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: white; padding: 20px; text-align: center; }
            .section { margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; }
            th { background: #f0f0f0; padding: 10px; text-align: left; font-weight: bold; }
            .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Pedido Confirmado!</h1>
              <p>TodoGastro</p>
            </div>

            <div class="section">
              <p>Hola ${orden.cliente.nombre},</p>
              <p>Tu pedido ha sido recibido y está siendo procesado.</p>
            </div>

            <div class="section">
              <h2>Detalles del Pedido</h2>
              <p><strong>ID Orden:</strong> ${orden.id}</p>
              <p><strong>Fecha:</strong> ${new Date(orden.fecha).toLocaleDateString('es-UY')}</p>
            </div>

            <div class="section">
              <h2>Items</h2>
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
            </div>

            <div class="section">
              <p style="margin: 10px 0;"><strong>Envío:</strong> $${orden.shippingCost.toLocaleString()}</p>
              ${orden.discount ? `<p style="margin: 10px 0;"><strong>Descuento:</strong> -$${orden.discount.toLocaleString()}</p>` : ''}
              <div class="total">
                <p>Total: $${orden.total.toLocaleString()}</p>
              </div>
            </div>

            <div class="section">
              <h2>Información de Envío</h2>
              <p>
                ${orden.cliente.nombre}<br>
                ${orden.cliente.direccion}<br>
                ${orden.cliente.ciudad}<br>
                Tel: ${orden.cliente.telefono}
              </p>
            </div>

            <div class="section">
              <h2>Método de Pago</h2>
              <p>${orden.metodoPago === 'mercadopago' ? 'Mercado Pago' : 'Transferencia Bancaria'}</p>
              ${
                orden.metodoPago === 'transferencia'
                  ? `
                <p style="background: #f0f0f0; padding: 15px; border-left: 4px solid #000;">
                  <strong>Datos Bancarios:</strong><br>
                  Banco: ITAÚ<br>
                  Cuenta: 12345678<br>
                  Tipo: Corriente<br>
                  Referencia: ${orden.id}
                </p>
              `
                  : ''
              }
            </div>

            <div class="footer">
              <p>¿Preguntas? Contactanos en info@todogastro.uy o por WhatsApp +598 9 2715 5555</p>
              <p>&copy; 2026 TodoGastro. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const result = await resend.emails.send({
      from: 'TodoGastro <noreply@todogastro.uy>',
      to: email,
      subject: `Confirmación de Pedido #${orden.id.substring(0, 8)}`,
      html,
    })

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Error enviando email' },
      { status: 500 }
    )
  }
}

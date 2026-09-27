import { NextRequest, NextResponse } from 'next/server'

const MercadoPago = require('mercadopago')

const mercadoPagoClient = new MercadoPago.MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
})

export async function POST(request: NextRequest) {
  try {
    const { items, email, orderId, shippingCost, discount } = await request.json()

    if (!items || !email || !orderId) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      )
    }

    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'Mercado Pago no está configurado' },
        { status: 500 }
      )
    }

    const preferenceClient = new (require('mercadopago')).Preference(mercadoPagoClient)

    const mp_items = items.map((item: any) => ({
      id: item.id,
      title: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      currency_id: 'UYU',
    }))

    if (shippingCost && shippingCost > 0) {
      mp_items.push({
        id: 'shipping',
        title: 'Envío',
        quantity: 1,
        unit_price: shippingCost,
        currency_id: 'UYU',
      })
    }

    if (discount && discount > 0) {
      mp_items.push({
        id: 'discount',
        title: 'Descuento',
        quantity: 1,
        unit_price: -discount,
        currency_id: 'UYU',
      })
    }

    const preferenceBody = {
      items: mp_items,
      payer: {
        email: email,
      },
      external_reference: orderId,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/checkout/confirmacion?status=success&id=${orderId}`,
        failure: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/checkout/confirmacion?status=failure&id=${orderId}`,
        pending: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/checkout/confirmacion?status=pending&id=${orderId}`,
      },
      notification_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/webhooks/mercadopago`,
      auto_return: 'approved',
    }

    const response = await preferenceClient.create({ body: preferenceBody })

    return NextResponse.json({
      id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point,
      success: true,
    })
  } catch (error) {
    console.error('Error creating payment preference:', error)
    return NextResponse.json(
      { error: 'Error procesando pago' },
      { status: 500 }
    )
  }
}

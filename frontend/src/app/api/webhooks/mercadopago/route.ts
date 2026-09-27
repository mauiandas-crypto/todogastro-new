import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const ordersPath = path.join(process.cwd(), 'src/data/orders.json')

function loadOrders() {
  try {
    if (fs.existsSync(ordersPath)) {
      const data = fs.readFileSync(ordersPath, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error loading orders:', error)
  }
  return []
}

function saveOrders(orders: any[]) {
  try {
    const dir = path.dirname(ordersPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2))
  } catch (error) {
    console.error('Error saving orders:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = body.data || {}
    const dataId = data.id

    if (!dataId) {
      return NextResponse.json({ success: false }, { status: 400 })
    }

    const orders = loadOrders()
    const order = orders.find((o: any) => o.id === data.external_reference)

    if (order) {
      if (data.status === 'approved') {
        order.estado = 'pagado'
      } else if (data.status === 'pending') {
        order.estado = 'pendiente'
      } else if (data.status === 'rejected' || data.status === 'cancelled') {
        order.estado = 'cancelado'
      }

      order.mercadopago_payment_id = dataId
      saveOrders(orders)

      console.log(`Order ${order.id} updated to ${order.estado}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

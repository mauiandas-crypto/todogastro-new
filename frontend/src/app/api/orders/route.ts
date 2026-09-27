import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface Order {
  id: string
  fecha: string
  cliente: {
    nombre: string
    email: string
    telefono: string
    direccion: string
    ciudad: string
  }
  items: any[]
  subtotal: number
  descuento: number
  cupon?: string | null
  costoEnvio: number
  total: number
  estado: string
  metodoPago: string
  fechaActualizacion: string
}

const ordersPath = path.join(process.cwd(), 'src/data/orders.json')

function loadOrders(): Order[] {
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

function saveOrders(orders: Order[]) {
  try {
    fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2))
  } catch (error) {
    console.error('Error saving orders:', error)
  }
}

export async function GET() {
  try {
    const orders = loadOrders()
    return NextResponse.json({ orders })
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching orders' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const order = await request.json()

    if (!order.id || !order.cliente) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 })
    }

    const orders = loadOrders()
    orders.push(order)
    saveOrders(orders)

    return NextResponse.json({ success: true, order }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Error creating order' }, { status: 500 })
  }
}

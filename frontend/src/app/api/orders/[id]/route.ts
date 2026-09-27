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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const orders = loadOrders()
    const order = orders.find((o: any) => o.id === id)

    if (!order) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching order' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'

// Cupones de demostración
const DEMO_COUPONS = [
  {
    code: 'BIENVENIDA10',
    active: true,
    expiresAt: new Date('2026-12-31'),
    usedCount: 0,
    maxUses: 9999,
    minPurchase: 0,
    discountType: 'percentage' as const,
    discount: 10,
    description: '10% descuento en tu primera compra',
  },
  {
    code: 'ENVIOGRATIS',
    active: true,
    expiresAt: new Date('2026-12-31'),
    usedCount: 0,
    maxUses: 9999,
    minPurchase: 1000,
    discountType: 'fixed' as const,
    discount: 200,
    description: 'Envío gratis en compras mayores a $1000',
  },
  {
    code: 'VERANO20',
    active: true,
    expiresAt: new Date('2026-12-31'),
    usedCount: 0,
    maxUses: 9999,
    minPurchase: 2000,
    discountType: 'percentage' as const,
    discount: 20,
    description: '20% en compras mayores a $2000',
  },
]

export async function POST(request: NextRequest) {
  try {
    const { codigo, total } = await request.json()

    if (!codigo || typeof codigo !== 'string') {
      return NextResponse.json(
        { valido: false, error: 'Ingresa un código de cupón' },
        { status: 400 }
      )
    }

    const cupon = DEMO_COUPONS.find(
      (c) => c.code.toUpperCase() === codigo.trim().toUpperCase()
    )

    if (!cupon) {
      return NextResponse.json({ valido: false, error: 'Cupón no encontrado' })
    }

    if (!cupon.active) {
      return NextResponse.json({ valido: false, error: 'Cupón inactivo' })
    }

    if (new Date(cupon.expiresAt) < new Date()) {
      return NextResponse.json({ valido: false, error: 'Cupón vencido' })
    }

    if (cupon.usedCount >= cupon.maxUses) {
      return NextResponse.json({ valido: false, error: 'Cupón agotado' })
    }

    if (cupon.minPurchase && total < cupon.minPurchase) {
      return NextResponse.json({
        valido: false,
        error: `Monto mínimo: $${cupon.minPurchase.toLocaleString('es-UY')}`,
      })
    }

    const descuento =
      cupon.discountType === 'percentage'
        ? (total * cupon.discount) / 100
        : cupon.discount

    return NextResponse.json({
      valido: true,
      cupon: {
        codigo: cupon.code,
        descripcion: cupon.description,
        descuento,
      },
    })
  } catch (error) {
    console.error('Error validating coupon:', error)
    return NextResponse.json(
      { valido: false, error: 'Error validando el cupón' },
      { status: 500 }
    )
  }
}

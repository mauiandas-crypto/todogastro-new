import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token no proporcionado' },
        { status: 400 }
      )
    }

    if (!process.env.RECAPTCHA_SECRET_KEY) {
      console.warn('RECAPTCHA_SECRET_KEY no está configurado')
      return NextResponse.json({ success: true })
    }

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    })

    const data = await response.json()

    if (data.success && data.score > 0.5) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { success: false, error: 'Validación reCAPTCHA fallida' },
      { status: 400 }
    )
  } catch (error) {
    console.error('reCAPTCHA verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Error verificando reCAPTCHA' },
      { status: 500 }
    )
  }
}

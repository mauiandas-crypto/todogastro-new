import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const newsletterPath = path.join(process.cwd(), 'src/data/newsletter.json')

function loadSubscribers() {
  try {
    if (fs.existsSync(newsletterPath)) {
      const data = fs.readFileSync(newsletterPath, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error loading subscribers:', error)
  }
  return []
}

function saveSubscribers(subscribers: any[]) {
  try {
    const dir = path.dirname(newsletterPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(newsletterPath, JSON.stringify(subscribers, null, 2))
  } catch (error) {
    console.error('Error saving subscribers:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    const subscribers = loadSubscribers()

    if (subscribers.some((sub: any) => sub.email === email)) {
      return NextResponse.json(
        { error: 'Ya estás suscrito', message: 'Ya estás suscrito a nuestro newsletter' },
        { status: 400 }
      )
    }

    subscribers.push({
      email,
      fecha: new Date().toISOString(),
      activo: true,
    })

    saveSubscribers(subscribers)

    return NextResponse.json({
      success: true,
      message: 'Suscripción exitosa',
    })
  } catch (error) {
    console.error('Error subscribing:', error)
    return NextResponse.json(
      { error: 'Error procesando suscripción' },
      { status: 500 }
    )
  }
}

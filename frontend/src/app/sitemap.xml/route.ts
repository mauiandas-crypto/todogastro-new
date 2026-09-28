import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://todogastro.uy'

  const urls = [
    { url: '/', changefreq: 'weekly', priority: '1.0' },
    { url: '/catalogo', changefreq: 'daily', priority: '0.9' },
    { url: '/carrito', changefreq: 'monthly', priority: '0.8' },
    { url: '/checkout', changefreq: 'monthly', priority: '0.8' },
    { url: '/privacidad', changefreq: 'yearly', priority: '0.5' },
    { url: '/terminos', changefreq: 'yearly', priority: '0.5' },
    { url: '/admin', changefreq: 'weekly', priority: '0.3' },
    { url: '/categoria/coccion', changefreq: 'daily', priority: '0.7' },
    { url: '/categoria/refrigeracion', changefreq: 'daily', priority: '0.7' },
    { url: '/categoria/elaboracion', changefreq: 'daily', priority: '0.7' },
    { url: '/categoria/equipamiento', changefreq: 'daily', priority: '0.7' },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (item) => `
  <url>
    <loc>${baseUrl}${item.url}</loc>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`
  )
  .join('')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}

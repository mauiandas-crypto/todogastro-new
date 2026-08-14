#!/usr/bin/env node
// Sincroniza data/products.json con el catalogo real de todogastro.com.uy
// (via la Store API publica de WooCommerce). Correr manualmente o por cron
// cuando haga falta refrescar precios/stock -- no se llama en cada arranque
// del server para no depender de la red ni pagar la latencia del scraping
// en cada deploy.
//
// Uso: npm run scrape:catalog
const fs = require('fs');
const path = require('path');
const { fetchAllProducts } = require('./wooCommerceClient');
const { mapProduct } = require('./transform');

const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'products.json');
const META_PATH = path.join(__dirname, '..', 'data', 'products.meta.json');

async function main() {
  console.log('[scrape] Sincronizando catalogo desde todogastro.com.uy...');

  try {
    const rawProducts = await fetchAllProducts({
      onProgress: ({ page, totalPages, fetched, total }) => {
        console.log(`[scrape] pagina ${page}/${totalPages} -- ${fetched}/${total} productos`);
      },
    });

    const skipped = [];
    const products = rawProducts
      .map((raw) => {
        try {
          return mapProduct(raw);
        } catch (err) {
          skipped.push({ id: raw && raw.id, error: err.message });
          return null;
        }
      })
      .filter(Boolean)
      // Solo productos comprables/publicados con precio conocido: uno sin
      // precio no le sirve al agente para responder ni para armar un pedido.
      .filter((p) => p.price != null);

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(products, null, 2), 'utf8');
    fs.writeFileSync(
      META_PATH,
      JSON.stringify(
        {
          source: 'https://www.todogastro.com.uy (WooCommerce Store API)',
          scrapedAt: new Date().toISOString(),
          productCount: products.length,
          skippedCount: skipped.length,
        },
        null,
        2
      ),
      'utf8'
    );

    console.log(`[scrape] ✅ OK: ${products.length} productos guardados en ${OUTPUT_PATH}`);
    if (skipped.length > 0) {
      console.warn(`[scrape] ⚠️  ${skipped.length} productos se saltearon por error de mapeo:`, skipped.slice(0, 5));
    }
  } catch (error) {
    console.error('[scrape] ❌ Fallo la sincronizacion del catalogo:', error.message);
    process.exitCode = 1;
  }
}

main();

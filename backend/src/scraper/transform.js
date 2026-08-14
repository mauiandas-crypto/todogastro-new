// Frases de relleno que TodoGastro repite en la descripcion de practicamente
// todos los productos (datos de contacto/horarios). Las sacamos para no
// mandarle a Claude el mismo bloque de texto en cada tool_result de
// get_product_details -- puro ruido que gasta tokens y no aporta nada para
// responder sobre el producto puntual.
const BOILERPLATE_MARKERS = [
  'somos todogastro',
  'nos ubicamos en',
  'horarios de atenci', // cubre "atención"/"atencion"
  'lunes a viernes',
];

const HTML_ENTITIES = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&#8211;': '-',
  '&#8212;': '-',
  '&#8216;': "'",
  '&#8217;': "'",
  '&#8220;': '"',
  '&#8221;': '"',
  '&quot;': '"',
  '&#039;': "'",
  '&lt;': '<',
  '&gt;': '>',
};

function decodeEntities(text) {
  return Object.entries(HTML_ENTITIES).reduce(
    (acc, [entity, char]) => acc.split(entity).join(char),
    text
  );
}

/**
 * HTML de WooCommerce -> texto plano legible, separando bloques por <p>/<br>
 * en saltos de linea.
 */
function htmlToText(html) {
  if (!html) return '';
  return decodeEntities(
    html
      .replace(/<\/(p|li|div)>/gi, '\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
  )
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n');
}

/**
 * Saca los <p>...</p> de relleno (contacto/horarios) que TodoGastro repite
 * en casi todas las descripciones. Filtra por bloque de parrafo completo
 * (no por linea suelta) porque el titulo y el dato suelen ir separados por
 * un <br> dentro del mismo <p> -- ej "NOS UBICAMOS EN:<br>– Aguada" -- y
 * filtrar solo la linea del titulo dejaria "– Aguada" colgando como si
 * fuera parte de la descripcion del producto.
 */
function stripBoilerplateHtml(html) {
  if (!html) return '';
  return html.replace(/<p[^>]*>[\s\S]*?<\/p>/gi, (block) => {
    const plain = block.replace(/<[^>]+>/g, ' ').toLowerCase();
    const isBoilerplate = BOILERPLATE_MARKERS.some((marker) => plain.includes(marker));
    return isBoilerplate ? '' : block;
  });
}

function cleanDescription(html) {
  return htmlToText(stripBoilerplateHtml(html));
}

/**
 * Convierte el precio de la Store API (string en unidad minima, ej "46000"
 * con currency_minor_unit=2) a un numero decimal normal (460.00). El monto
 * numerico es confiable; la moneda NO -- ver extractDisplayCurrency.
 */
function parsePrice(prices) {
  if (!prices || prices.price == null) return null;
  const minorUnit = Number.isInteger(prices.currency_minor_unit) ? prices.currency_minor_unit : 2;
  const raw = Number(prices.price);
  if (Number.isNaN(raw)) return null;
  return raw / 10 ** minorUnit;
}

/**
 * `prices.currency_code` de la Store API viene fijo en "UYU" para TODOS los
 * productos, pero el sitio en realidad muestra varios productos en USD (via
 * algun plugin de multi-moneda que no actualiza ese campo). El campo
 * confiable es `price_html`, que trae el simbolo realmente mostrado al
 * cliente (ej "USD 460,00" o "UYU 9.550,00"). Verificado comparando varios
 * productos: el monto numerico de prices.price/10^minor_unit siempre
 * coincide con el de price_html, solo cambia la moneda.
 */
function extractDisplayCurrency(priceHtml, fallback) {
  if (!priceHtml) return fallback || null;
  const plain = decodeEntities(priceHtml.replace(/<[^>]+>/g, '')).trim();
  const match = plain.match(/^([A-Z]{2,4})/);
  return match ? match[1] : fallback || null;
}

/**
 * Mapea un producto crudo de wc/store/v1/products al formato interno que
 * usa productCatalog.js / los tool handlers.
 */
function mapProduct(raw) {
  const categories = Array.isArray(raw.categories) ? raw.categories.map((c) => c.name) : [];
  const description = cleanDescription(raw.description);
  const shortDescription =
    cleanDescription(raw.short_description) ||
    description.split('\n')[0] ||
    raw.name;

  return {
    id: `WC-${raw.id}`,
    sku: raw.sku || null,
    name: raw.name,
    category: categories[0] || 'Sin categoria',
    categories,
    price: parsePrice(raw.prices),
    currency: extractDisplayCurrency(raw.price_html, raw.prices ? raw.prices.currency_code : null),
    in_stock: Boolean(raw.is_in_stock),
    stock_quantity: typeof raw.stock_quantity === 'number' ? raw.stock_quantity : null,
    short_description: shortDescription.slice(0, 300),
    description: description.slice(0, 2000),
    url: raw.permalink || null,
    images: Array.isArray(raw.images) ? raw.images.map(img => ({
      src: img.src,
      alt: img.alt || raw.name
    })) : []
  };
}

module.exports = {
  htmlToText,
  stripBoilerplateHtml,
  cleanDescription,
  parsePrice,
  extractDisplayCurrency,
  mapProduct,
};

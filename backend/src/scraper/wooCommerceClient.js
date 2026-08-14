// Cliente minimo para la Store API publica de WooCommerce
// (https://www.todogastro.com.uy usa WooCommerce). Este endpoint es publico
// y de solo lectura -- no hace falta API key ni auth.
const BASE_URL = 'https://www.todogastro.com.uy/wp-json/wc/store/v1';
const USER_AGENT = 'TodoGastroBot-CatalogSync/1.0 (+sincronizacion interna de catalogo)';

const MAX_PER_PAGE = 100; // limite tipico de la Store API de WooCommerce
const RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const REQUEST_DELAY_MS = 300; // pausa entre paginas para no martillar el sitio

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, attempt = 1) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText} para ${url}`);
    }
    return res;
  } catch (err) {
    if (attempt >= RETRIES) throw err;
    await sleep(RETRY_DELAY_MS * attempt);
    return fetchWithRetry(url, attempt + 1);
  }
}

/**
 * Trae una pagina de productos de la Store API.
 * @returns {Promise<{ products: object[], totalPages: number, total: number }>}
 */
async function fetchProductsPage(page, perPage = MAX_PER_PAGE) {
  const url = `${BASE_URL}/products?page=${page}&per_page=${perPage}&orderby=title&order=asc`;
  const res = await fetchWithRetry(url);
  const products = await res.json();
  const totalPages = Number(res.headers.get('x-wp-totalpages')) || 1;
  const total = Number(res.headers.get('x-wp-total')) || products.length;
  return { products, totalPages, total };
}

/**
 * Trae TODOS los productos publicados del catalogo, paginando hasta el final.
 */
async function fetchAllProducts({ onProgress } = {}) {
  const { products: firstPage, totalPages, total } = await fetchProductsPage(1);
  const allProducts = [...firstPage];
  if (onProgress) onProgress({ page: 1, totalPages, fetched: allProducts.length, total });

  for (let page = 2; page <= totalPages; page++) {
    await sleep(REQUEST_DELAY_MS);
    const { products } = await fetchProductsPage(page);
    allProducts.push(...products);
    if (onProgress) onProgress({ page, totalPages, fetched: allProducts.length, total });
  }

  return allProducts;
}

module.exports = { fetchProductsPage, fetchAllProducts };

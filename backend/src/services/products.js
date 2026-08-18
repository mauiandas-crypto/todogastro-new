const fs = require('fs');
const path = require('path');

// Base de datos en memoria (productos)
let products = [];
let lastSync = null;

/**
 * Carga productos del archivo JSON de caché
 */
function loadProductsFromCache() {
  try {
    // Intentar cargar productos.json (nuevo) primero, luego products.json (viejo)
    let dataPath = path.join(__dirname, '../data/productos.json');
    if (!fs.existsSync(dataPath)) {
      dataPath = path.join(__dirname, '../data/products.json');
    }

    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, 'utf8');
      products = JSON.parse(data);
      console.log(`✅ Cargados ${products.length} productos del caché`);
      // Verificar que categories es array
      if (products.length > 0 && products[0].categories && !Array.isArray(products[0].categories)) {
        console.warn('⚠️ Categorías no es array, convirtiendo...');
        products.forEach(p => {
          if (p.categories && typeof p.categories === 'object' && !Array.isArray(p.categories)) {
            p.categories = Object.values(p.categories);
          }
        });
      }
      return true;
    }
  } catch (error) {
    console.error('❌ Error cargando productos:', error.message);
  }
  return false;
}

/**
 * Obtener todos los productos con paginación
 */
function getProducts(filters = {}) {
  // Recargar datos si está vacío o si se solicita una categoría
  if (products.length === 0 || filters.category) {
    loadProductsFromCache();
  }

  let filtered = [...products];

  // Filtrar por categoría si se proporciona
  if (filters.category) {
    const categoryFilter = filters.category.toLowerCase();
    filtered = filtered.filter(p => {
      // Intentar filtrar por categories (nuevo) o categoria (antiguo)
      if (p.categories && Array.isArray(p.categories)) {
        return p.categories.some(cat =>
          cat.toLowerCase().includes(categoryFilter)
        );
      } else if (p.categoria) {
        // Fallback: buscar en el campo categoria string
        return p.categoria.toLowerCase().includes(categoryFilter);
      }
      return false;
    });
  }

  // Búsqueda por texto
  if (filters.search) {
    const term = filters.search.toLowerCase();
    filtered = filtered.filter(p =>
      p.nombre.toLowerCase().includes(term) ||
      p.descripcion.toLowerCase().includes(term)
    );
  }

  // Paginación
  const page = Math.max(1, parseInt(filters.page) || 1);
  const limit = Math.min(100, parseInt(filters.limit) || 20);
  const start = (page - 1) * limit;

  const paginated = filtered.slice(start, start + limit);

  // Transformar campos de español a inglés
  const transformed = paginated.map(p => ({
    id: p.id,
    sku: p.sku,
    name: p.nombre,
    category: p.categoria ? p.categoria.split(' > ')[0] : 'Sin categoría',
    categories: p.categories,
    description: p.descripcion,
    price: p.precio,
    currency: p.moneda,
    in_stock: p.stock > 0,
    stock_quantity: p.stock,
    images: (p.imagenes || []).map(img => ({
      src: img,
      alt: p.nombre
    })),
    url: `/producto/${p.id}`
  }));

  return {
    data: transformed,
    pagination: {
      page,
      limit,
      total: filtered.length,
      pages: Math.ceil(filtered.length / limit)
    }
  };
}

/**
 * Obtener un producto por ID
 */
function getProductById(id) {
  const p = products.find(p => p.id === id);
  if (!p) return null;

  // Transformar campos de español a inglés
  return {
    id: p.id,
    sku: p.sku,
    name: p.nombre,
    category: p.categoria ? p.categoria.split(' > ')[0] : 'Sin categoría',
    categories: p.categories,
    description: p.descripcion,
    price: p.precio,
    currency: p.moneda,
    in_stock: p.stock > 0,
    stock_quantity: p.stock,
    images: (p.imagenes || []).map(img => ({
      src: img,
      alt: p.nombre
    })),
    url: `/producto/${p.id}`
  };
}

/**
 * Obtener categorías únicas
 */
function getCategories() {
  const categoriesSet = new Set();
  products.forEach(p => {
    if (Array.isArray(p.categories)) {
      p.categories.forEach(cat => categoriesSet.add(cat));
    }
  });
  return Array.from(categoriesSet).sort();
}

/**
 * Información de sincronización
 */
function getSyncInfo() {
  return {
    totalProducts: products.length,
    lastSync,
    cacheFile: path.join(__dirname, '../data/products.json'),
    nextSyncScheduled: 'PENDING' // Se actualiza cuando configuremos scheduler
  };
}

// Cargar productos al inicializar
loadProductsFromCache();

module.exports = {
  getProducts,
  getProductById,
  getCategories,
  getSyncInfo,
  loadProductsFromCache
};

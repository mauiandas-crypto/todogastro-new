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
    const dataPath = path.join(__dirname, '../data/products.json');
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, 'utf8');
      products = JSON.parse(data);
      console.log(`✅ Cargados ${products.length} productos del caché`);
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
  let filtered = [...products];

  // Filtrar por categoría si se proporciona
  if (filters.category) {
    const categoryFilter = filters.category.toLowerCase();
    filtered = filtered.filter(p =>
      p.categories && p.categories.some(cat =>
        cat.toLowerCase().includes(categoryFilter)
      )
    );
  }

  // Búsqueda por texto
  if (filters.search) {
    const term = filters.search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term)
    );
  }

  // Paginación
  const page = Math.max(1, parseInt(filters.page) || 1);
  const limit = Math.min(100, parseInt(filters.limit) || 20);
  const start = (page - 1) * limit;

  const paginated = filtered.slice(start, start + limit);

  return {
    data: paginated,
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
  return products.find(p => p.id === id);
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

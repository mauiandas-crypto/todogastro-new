const express = require('express');
const productsService = require('../services/products');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/products/categories
 * Obtiene lista de categorías disponibles
 */
router.get('/categories', optionalAuth, (req, res) => {
  try {
    const categories = productsService.getCategories();
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/products/sync/info
 * Información de la última sincronización
 */
router.get('/sync/info', (req, res) => {
  try {
    const syncInfo = productsService.getSyncInfo();
    res.json(syncInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/products/debug/sample
 * Debug: retorna un producto de ejemplo para verificar estructura
 */
router.get('/debug/sample', (req, res) => {
  try {
    const result = productsService.getProducts({ limit: 1 });
    if (result.data.length > 0) {
      const p = result.data[0];
      res.json({
        product: p,
        categoriesType: typeof p.categories,
        categoriesIsArray: Array.isArray(p.categories),
        categoriesKeys: p.categories ? Object.keys(p.categories) : [],
        categoriesValue: p.categories
      });
    } else {
      res.json({ error: 'No products found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/products/sync/reload
 * Admin: recarga los productos desde el archivo JSON
 */
router.post('/sync/reload', (req, res) => {
  try {
    productsService.loadProductsFromCache();
    const result = productsService.getProducts({ limit: 1 });
    res.json({
      success: true,
      message: 'Products reloaded from cache',
      productCount: productsService.getProducts({ limit: 999999 }).pagination.total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/products
 * Obtiene lista de productos con paginación y filtros
 * Query params:
 * - page: número de página (default: 1)
 * - limit: productos por página (default: 20, max: 100)
 * - category: filtrar por categoría
 * - search: búsqueda por texto
 */
router.get('/', optionalAuth, (req, res) => {
  try {
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      category: req.query.category,
      search: req.query.search
    };

    const result = productsService.getProducts(filters);

    res.json({
      products: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/products/:id
 * Obtiene detalles de un producto específico
 */
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const product = productsService.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

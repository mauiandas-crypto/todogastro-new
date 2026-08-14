const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Base de datos en memoria temporal
const orders = new Map();
let orderIdCounter = 1000;

/**
 * GET /api/orders
 * Obtiene pedidos del usuario autenticado
 */
router.get('/', authenticateToken, (req, res) => {
  try {
    const userOrders = Array.from(orders.values())
      .filter(o => o.userId === req.user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      orders: userOrders,
      total: userOrders.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/orders/:id
 * Obtiene detalles de un pedido específico
 */
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const order = orders.get(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    if (order.userId !== req.user.id) {
      return res.status(403).json({ error: 'No tiene permiso para ver este pedido' });
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/orders
 * Crea un nuevo pedido
 */
router.post('/', authenticateToken, (req, res) => {
  try {
    const { items, shippingAddress, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'El pedido debe tener al menos un producto' });
    }

    // Calcular total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order = {
      id: String(orderIdCounter++),
      userId: req.user.id,
      items,
      shippingAddress,
      notes,
      total,
      status: 'pending', // pending, processing, shipped, delivered, cancelled
      paymentStatus: 'unpaid', // unpaid, paid, refunded
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.set(order.id, order);

    res.status(201).json({
      message: 'Pedido creado exitosamente',
      order
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * PATCH /api/orders/:id
 * Actualiza estado de un pedido (solo el usuario puede actualizar ciertos campos)
 */
router.patch('/:id', authenticateToken, (req, res) => {
  try {
    const order = orders.get(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    if (order.userId !== req.user.id) {
      return res.status(403).json({ error: 'No tiene permiso para actualizar este pedido' });
    }

    // Solo puede actualizar notas
    if (req.body.notes) {
      order.notes = req.body.notes;
      order.updatedAt = new Date().toISOString();
    }

    res.json({
      message: 'Pedido actualizado',
      order
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

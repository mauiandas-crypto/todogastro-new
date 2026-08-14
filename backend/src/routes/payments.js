const express = require('express');
const config = require('../config');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/payments/mercadopago/preference
 * Crea una preferencia de pago en MercadoPago
 *
 * IMPORTANTE: Esta ruta está lista para integrarse cuando tengas
 * las credenciales de MercadoPago (Access Token)
 */
router.post('/mercadopago/preference', authenticateToken, async (req, res) => {
  try {
    // Verificar que MercadoPago esté configurado
    if (!config.mercadopago.enabled) {
      return res.status(503).json({
        error: 'MercadoPago no está configurado aún',
        message: 'Por favor configura MERCADOPAGO_ACCESS_TOKEN en .env'
      });
    }

    const { orderId, items, shippingAddress, buyerInfo } = req.body;

    if (!orderId || !items || !shippingAddress) {
      return res.status(400).json({
        error: 'orderId, items y shippingAddress son requeridos'
      });
    }

    // TODO: Integración con API de MercadoPago
    // const preferenceData = {
    //   items: items.map(item => ({
    //     title: item.name,
    //     quantity: item.quantity,
    //     unit_price: item.price,
    //     currency_id: 'UYU'
    //   })),
    //   payer: {
    //     email: buyerInfo.email,
    //     name: buyerInfo.name
    //   },
    //   back_urls: {
    //     success: `${config.frontendUrl}/checkout/success?order_id=${orderId}`,
    //     failure: `${config.frontendUrl}/checkout/failure?order_id=${orderId}`,
    //     pending: `${config.frontendUrl}/checkout/pending?order_id=${orderId}`
    //   },
    //   notification_url: `${config.frontendUrl}/api/payments/mercadopago/webhook`,
    //   metadata: {
    //     order_id: orderId,
    //     user_id: req.user.id
    //   }
    // };

    res.status(503).json({
      error: 'Integración no completada',
      message: 'Por favor configura MercadoPago y completa la integración',
      status: 'pending'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/payments/mercadopago/webhook
 * Recibe notificaciones de MercadoPago
 */
router.post('/mercadopago/webhook', (req, res) => {
  try {
    // TODO: Validar webhook de MercadoPago
    // const { data, type } = req.body;

    // if (type === 'payment') {
    //   // Procesar pago
    // } else if (type === 'plan') {
    //   // Procesar plan
    // }

    res.json({ status: 'received' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/payments/status
 * Información sobre el estado de pagos (admin)
 */
router.get('/status', (req, res) => {
  res.json({
    mercadopago: {
      configured: config.mercadopago.enabled,
      status: config.mercadopago.enabled ? 'ready' : 'not_configured'
    },
    stripe: {
      configured: false,
      status: 'not_configured'
    }
  });
});

module.exports = router;

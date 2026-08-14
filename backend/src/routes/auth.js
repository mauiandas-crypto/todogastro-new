const express = require('express');
const authService = require('../services/auth');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/auth/register
 * Registra un nuevo usuario
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password y name son requeridos' });
    }

    const user = await authService.register(email, password, name);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /api/auth/login
 * Autentica un usuario y retorna JWT
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password son requeridos' });
    }

    const result = await authService.login(email, password);

    res.json({
      message: 'Login exitoso',
      token: result.token,
      user: result.user
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

/**
 * GET /api/auth/me
 * Obtiene la información del usuario autenticado
 */
router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = authService.getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

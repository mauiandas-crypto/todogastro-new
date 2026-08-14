const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

// Base de datos en memoria temporal (hasta que tengamos PostgreSQL)
const users = new Map();
let userIdCounter = 1;

/**
 * Registra un nuevo usuario
 */
async function register(email, password, name) {
  // Validar que el usuario no exista
  const existingUser = Array.from(users.values()).find(u => u.email === email);
  if (existingUser) {
    throw new Error('El email ya está registrado');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: String(userIdCounter++),
    email,
    name,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
    orders: []
  };

  users.set(user.id, user);
  return user;
}

/**
 * Login de usuario
 */
async function login(email, password) {
  const user = Array.from(users.values()).find(u => u.email === email);

  if (!user) {
    throw new Error('Email o contraseña incorrectos');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error('Email o contraseña incorrectos');
  }

  // Generar JWT
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    config.jwt.secret,
    { expiresIn: config.jwt.expiry }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  };
}

/**
 * Obtener usuario por ID
 */
function getUserById(userId) {
  return users.get(userId);
}

/**
 * Listar todos los usuarios (solo para admin)
 */
function getAllUsers() {
  return Array.from(users.values()).map(u => ({
    id: u.id,
    email: u.email,
    name: u.name,
    createdAt: u.createdAt
  }));
}

module.exports = {
  register,
  login,
  getUserById,
  getAllUsers
};

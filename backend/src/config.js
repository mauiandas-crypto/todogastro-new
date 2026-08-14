module.exports = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  jwt: {
    secret: process.env.JWT_SECRET || 'change-me-in-production',
    expiry: process.env.JWT_EXPIRY || '7d'
  },

  database: {
    type: process.env.DATABASE_TYPE || 'memory',
    url: process.env.DATABASE_URL
  },

  odoo: {
    enabled: Boolean(process.env.ODOO_URL),
    url: process.env.ODOO_URL,
    db: process.env.ODOO_DB,
    username: process.env.ODOO_USERNAME,
    password: process.env.ODOO_PASSWORD,
    syncInterval: 24 * 60 * 60 * 1000 // cada 24 horas
  },

  mercadopago: {
    enabled: Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN),
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    publicKey: process.env.MERCADOPAGO_PUBLIC_KEY
  },

  email: {
    enabled: Boolean(process.env.SMTP_HOST),
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
};

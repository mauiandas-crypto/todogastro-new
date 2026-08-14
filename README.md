# TodoGastro - Nueva Plataforma E-commerce

Proyecto de e-commerce moderno para TodoGastro con Next.js + Express + Odoo integration.

## 📁 Estructura del Proyecto

```
todogastro-new/
├── frontend/          # App web (Next.js 16 + React 19 + TypeScript)
├── backend/           # API REST (Express + Node.js)
└── README.md          # Este archivo
```

## 🚀 Quick Start

### Backend

```bash
cd backend

# Instalar dependencias
npm install

# Descargar productos de tu tienda actual
npm run scrape:catalog

# Iniciar servidor
npm run dev
```

El backend estará disponible en **http://localhost:3001**

**Endpoints disponibles:**
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Datos del usuario autenticado
- `GET /api/products` - Listar productos (con paginación y filtros)
- `GET /api/products/:id` - Detalles de un producto
- `GET /api/products/categories` - Categorías
- `GET /api/orders` - Mis pedidos
- `POST /api/orders` - Crear pedido
- `GET /api/payments/status` - Estado de integraciones de pago

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en **http://localhost:3000**

## 🔧 Configuración

### Backend (.env)

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=tu_super_secreto_cambiar_en_produccion
DATABASE_TYPE=memory  # En desarrollo

# Cuando Odoo esté listo:
# ODOO_URL=https://todogastro.odoo.com
# ODOO_DB=todogastro
# ODOO_USERNAME=admin
# ODOO_PASSWORD=password

# Cuando MercadoPago esté configurado:
# MERCADOPAGO_ACCESS_TOKEN=tu_token
# MERCADOPAGO_PUBLIC_KEY=tu_key
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=TodoGastro
```

## 📦 Características Implementadas

### ✅ Backend
- [x] API REST con Express
- [x] Autenticación JWT (login/registro)
- [x] Gestión de productos (catálogo de WooCommerce)
- [x] Gestión de pedidos
- [x] Scraper de productos desde todogastro.com.uy
- [ ] Integración Odoo (pendiente credenciales)
- [ ] Integración MercadoPago (pendiente keys)
- [ ] Base de datos PostgreSQL (en desarrollo)

### ✅ Frontend
- [x] Proyecto Next.js 16 configurado
- [x] TypeScript + Tailwind CSS
- [ ] Página home
- [ ] Catálogo de productos
- [ ] Detalle de producto
- [ ] Carrito de compras
- [ ] Checkout
- [ ] Sistema de login/registro
- [ ] Panel de cliente
- [ ] Admin panel

## 🔄 Flujo de Datos

```
todogastro.com.uy (WooCommerce)
    ↓
Backend (Express)
    ├─ Scraper → products.json
    ├─ API REST
    └─ JWT Auth
        ↓
Frontend (Next.js)
    ├─ Catálogo
    ├─ Carrito
    └─ Checkout
```

**Próximamente:**
```
Odoo Cloud
    ↓
Backend (Odoo API Client)
    ├─ Sincronizar productos
    ├─ Sincronizar precios/stock
    └─ Crear pedidos
        ↓
    Frontend/Checkout
```

## 🛠️ Scripts Disponibles

### Backend
```bash
npm run dev              # Iniciar servidor (watch mode)
npm run start            # Iniciar servidor
npm run scrape:catalog   # Descargar productos de todogastro.com.uy
```

### Frontend
```bash
npm run dev     # Iniciar servidor de desarrollo
npm run build   # Compilar para producción
npm run start   # Iniciar servidor de producción
npm run lint    # Linting
```

## 🔐 Seguridad

- Passwords hasheados con bcryptjs
- JWT para autenticación stateless
- CORS configurado
- Variables de entorno para datos sensibles

**⚠️ IMPORTANTE:** Cambiar `JWT_SECRET` en producción

## 📚 Próximos Pasos

1. **Sincronizar productos actuales**
   ```bash
   cd backend
   npm run scrape:catalog
   ```

2. **Configurar Odoo** (cuando esté listo)
   - Obtener credenciales
   - Agregar a .env
   - Descomentar integración en código

3. **Configurar MercadoPago**
   - Crear cuenta en mercadopago.com
   - Obtener Access Token y Public Key
   - Agregar a .env del backend

4. **Desarrollar Frontend**
   - Páginas de catálogo
   - Sistema de carrito
   - Checkout
   - Panel de cliente

## 📝 Notas

- Base de datos en **memoria** (desarrollo)
- Para producción: configurar PostgreSQL
- Datos de usuarios/pedidos se pierden al reiniciar
- Images hosted remotamente (desde WooCommerce)

## ❓ Preguntas

Para consultas sobre la integración, revisar comentarios en el código con `TODO` y `FIXME`.

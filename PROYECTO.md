# 🎯 Proyecto: Nueva TodoGastro

**Estado:** ✅ Estructura base completada  
**Fecha:** 14 de agosto de 2026  
**Ubicación:** `C:\Users\mauri\todogastro-new`

---

## 📊 Resumen

Se creó una nueva plataforma de e-commerce moderna para TodoGastro que:
- ✅ Utiliza **Next.js 16** para el frontend (moderno, rápido, SEO)
- ✅ Utiliza **Express.js** para el backend (ligero, escalable)
- ✅ Sincroniza **817 productos** de tu tienda actual (todogastro.com.uy)
- ⏳ Lista para conectar con **Odoo** cuando esté disponible
- ⏳ Lista para integrar **MercadoPago** cuando tengas las keys

---

## 🗂️ Estructura Creada

```
todogastro-new/
├── .claude/
│   └── launch.json                 ← Config para ejecutar servidores
├── backend/                        ← API REST (Node.js + Express)
│   ├── src/
│   │   ├── index.js                ← Entry point
│   │   ├── config.js               ← Configuración
│   │   ├── middleware/
│   │   │   └── auth.js             ← JWT authentication
│   │   ├── routes/
│   │   │   ├── auth.js             ← Login/registro
│   │   │   ├── products.js         ← Catálogo (GET)
│   │   │   ├── orders.js           ← Pedidos (GET/POST/PATCH)
│   │   │   └── payments.js         ← Pagos (MercadoPago ready)
│   │   ├── services/
│   │   │   ├── auth.js             ← Lógica de usuarios
│   │   │   └── products.js         ← Lógica de productos
│   │   ├── scraper/
│   │   │   ├── scrapeCatalog.js    ← Script de sincronización
│   │   │   ├── wooCommerceClient.js ← Cliente WooCommerce API
│   │   │   └── transform.js        ← Limpieza de datos
│   │   └── data/
│   │       ├── products.json       ← 817 productos sincronizados ✅
│   │       └── products.meta.json  ← Metadata de sincronización
│   ├── .env                        ← Variables de entorno
│   └── package.json                ← Dependencias
│
├── frontend/                       ← App web (Next.js + React)
│   ├── app/
│   │   ├── layout.tsx              ← Layout principal
│   │   ├── page.tsx                ← Home (placeholder)
│   │   └── ...                     ← (Rutas por crear)
│   ├── components/                 ← Componentes React
│   ├── lib/
│   │   └── api.ts                  ← Cliente HTTP + JWT interceptor
│   ├── .env.local                  ← Variables de entorno
│   └── package.json                ← Dependencias
│
├── README.md                       ← Documentación principal
├── PROYECTO.md                     ← Este archivo
└── .gitignore                      ← (Por crear)
```

---

## 🚀 Cómo Ejecutar

### Backend
```bash
cd C:\Users\mauri\todogastro-new\backend
npm run dev
```
Disponible en: **http://localhost:3001**

### Frontend
```bash
cd C:\Users\mauri\todogastro-new\frontend
npm run dev
```
Disponible en: **http://localhost:3000**

**O simplemente desde la raíz:**
```bash
# Abre Claude Code con preview_start("backend")
# Abre Claude Code con preview_start("frontend")
```

---

## 📦 Datos Sincronizados

✅ **817 productos** descargados exitosamente de **todogastro.com.uy**

Cada producto incluye:
- ID único
- Nombre y descripción
- Precio (en USD o UYU)
- Stock disponible
- Categoría(s)
- URL del producto original
- Imágenes
- Atributos técnicos

**Archivo:** `backend/src/data/products.json` (1.41 MB)

**Actualizar productos:** 
```bash
cd backend && npm run scrape:catalog
```

---

## 🔐 Autenticación Implementada

**Sistema JWT (JSON Web Tokens)**

### Endpoints de Auth:
```
POST   /api/auth/register          → Crear usuario
POST   /api/auth/login             → Autenticar y obtener token
GET    /api/auth/me                → Datos del usuario actual
```

### Usuarios en Base de Datos (en memoria):
```json
{
  "id": "1",
  "email": "usuario@example.com",
  "name": "Nombre Usuario",
  "password": "hasheada con bcryptjs",
  "createdAt": "2026-08-14T10:00:00Z",
  "orders": []
}
```

---

## 📋 Endpoints de API

### Productos
```
GET  /api/products                 → Listar con paginación/filtros
GET  /api/products/:id             → Detalle de producto
GET  /api/products/categories      → Categorías disponibles
GET  /api/products/sync/info       → Info de última sincronización
```

### Pedidos
```
GET  /api/orders                   → Mis pedidos (autenticado)
GET  /api/orders/:id               → Detalle de pedido
POST /api/orders                   → Crear pedido
PATCH /api/orders/:id              → Actualizar pedido
```

### Pagos
```
GET  /api/payments/status          → Estado de integraciones
POST /api/payments/mercadopago/preference → Crear preferencia (en desarrollo)
```

---

## ⚙️ Configuración

### Backend (.env)
```env
PORT=3001                                   # Puerto del servidor
NODE_ENV=development                       # Desarrollo/producción
FRONTEND_URL=http://localhost:3000         # URL del frontend
JWT_SECRET=cambiar-en-produccion           # Clave para firmar tokens
DATABASE_TYPE=memory                       # en-memoria para desarrollo

# Cuando Odoo esté listo (PENDIENTE):
# ODOO_URL=https://todogastro.odoo.com
# ODOO_DB=todogastro
# ODOO_USERNAME=usuario
# ODOO_PASSWORD=password

# Cuando MercadoPago esté configurado (PENDIENTE):
# MERCADOPAGO_ACCESS_TOKEN=...
# MERCADOPAGO_PUBLIC_KEY=...
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001  # URL del API
NEXT_PUBLIC_APP_NAME=TodoGastro           # Nombre de la app
```

---

## 🔄 Próximas Fases

### Fase 2: Frontend (Semana 2)
- [ ] Página de home con heroes/destacados
- [ ] Catálogo de productos (listado + filtros)
- [ ] Búsqueda por texto
- [ ] Detalle de producto
- [ ] Carrito de compras (localStorage)
- [ ] Página de checkout

### Fase 3: Autenticación (Semana 2)
- [ ] Página de login
- [ ] Página de registro
- [ ] Panel del cliente
- [ ] Historial de pedidos
- [ ] Recuperación de contraseña

### Fase 4: Pagos (Semana 3)
- [ ] Integración MercadoPago
  - [ ] Crear preferencia de pago
  - [ ] Webhook de confirmación
  - [ ] Página de success/failure
- [ ] Email de confirmación

### Fase 5: Odoo (Cuando esté listo)
- [ ] Configurar credenciales Odoo
- [ ] Sincronización automática de productos
- [ ] Crear órdenes en Odoo
- [ ] Sincronizar stock
- [ ] Sincronizar clientes

### Fase 6: Admin Panel (Semana 4)
- [ ] Dashboard de ventas
- [ ] Gestión de pedidos
- [ ] Reportes
- [ ] Configuración

### Fase 7: Deploy
- [ ] Frontend → Vercel
- [ ] Backend → AWS/Heroku/Render
- [ ] Base de datos PostgreSQL
- [ ] Dominio todogastro.com.uy

---

## 🛠️ Tecnologías Usadas

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | Next.js | 16.3.0 |
| Frontend | React | 19.2.8 |
| Frontend | TypeScript | 5 |
| Frontend | Tailwind CSS | 4 |
| Backend | Express | 5.2.1 |
| Backend | Node.js | 18+ |
| Auth | JWT (jsonwebtoken) | 9.0.3 |
| Hashing | bcryptjs | 3.0.3 |
| HTTP | axios | 1.19.0 |
| HTTP | fetch nativa | - |
| CORS | cors | 2.8.6 |

---

## ✅ Checklist Actual

- [x] Crear estructura Next.js
- [x] Crear estructura Express
- [x] Configurar JWT
- [x] Scraper de productos
- [x] Sincronizar 817 productos ✅
- [x] Rutas de autenticación
- [x] Rutas de productos
- [x] Rutas de pedidos
- [x] Rutas de pagos (placeholder)
- [ ] Crear páginas frontend
- [ ] Integrar Odoo
- [ ] Integrar MercadoPago
- [ ] Crear admin panel
- [ ] Desplegar a producción

---

## 📝 Notas Importantes

### 🗄️ Base de Datos
- **En desarrollo:** En memoria (datos se pierden al reiniciar)
- **En producción:** PostgreSQL (RDS, Render, Supabase)

### 🖼️ Imágenes
- Almacenadas en WooCommerce (todogastro.com.uy)
- Se descargan bajo demanda desde el frontend
- Optimización: Lazy loading + WebP + Next.js Image component

### 🔐 Seguridad
- Passwords hasheadas con bcryptjs
- JWT stateless para escalabilidad
- CORS restringido al frontend
- Variables de entorno para datos sensibles
- **IMPORTANTE:** Cambiar JWT_SECRET en producción

### 📊 Datos
- Usuarios: En memoria (desarrollo)
- Productos: En archivo JSON (cache de WooCommerce)
- Pedidos: En memoria (desarrollo)
- **Próximo:** Migrar a PostgreSQL

---

## 🤝 Cómo Continuar

1. **Ejecutar los servidores**
   ```bash
   npm run dev  # Backend
   npm run dev  # Frontend
   ```

2. **Verificar que funciona**
   - Backend: http://localhost:3001/health
   - Frontend: http://localhost:3000

3. **Siguiente:** Crear las páginas del frontend (home, catálogo, etc.)

4. **Luego:** Integrar Odoo y MercadoPago

---

**Proyecto iniciado:** 13 de agosto de 2026  
**Última actualización:** 14 de agosto de 2026  
**Estado:** 🟢 Listo para desarrollo de frontend

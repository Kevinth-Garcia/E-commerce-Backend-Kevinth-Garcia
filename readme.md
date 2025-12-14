Backend desarrollado como parte del **Trabajo Práctico Integrador** del Bootcamp **Full Stack Engineer**, utilizando **Node.js, Express y MongoDB**, implementando autenticación con **JWT**, manejo de roles y operaciones CRUD.

---

## 📌 Tecnologías Utilizadas

- Node.js
- Express
- MongoDB + Mongoose
- JWT (JSON Web Tokens)
- bcrypt / bcryptjs
- express-validator
- dotenv
- cors
- Nodemailer (Email Service)

---

## 🔐 Autenticación y Seguridad

El sistema implementa:

- Registro y login de usuarios
- Hash de contraseñas con **bcrypt**
- Autenticación basada en **JWT**
- Middleware de protección de rutas (`authenticateToken`)
- Middleware de autorización por roles (`authAdmin`)
- Validación de datos de entrada con **express-validator**

---

## 🗄️ Base de Datos (MongoDB + Mongoose)

### Usuario
- email
- password (encriptado)
- nombre
- apellido
- isAdmin
- isEmailVerified
- tokens de verificación y recuperación

### Producto
- nombre
- descripción
- precio
- imagen (URL)
- fecha de creación

### Orden
- referencia al usuario
- array de productos (precio congelado)
- total
- fecha

---

## 🌐 Endpoints Implementados

### 🔑 Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/verify-email/:token`

---

### 📦 Productos
- `GET /api/productRoutes` (Público)
- `GET /api/productRoutes/:id` (Público)
- `POST /api/productRoutes` (Admin)
- `PUT /api/productRoutes/:id` (Admin)
- `DELETE /api/productRoutes/:id` (Admin)

---

### 🧾 Órdenes
- `POST /api/orderRoutes` (Usuario autenticado)
- `GET /api/orderRoutes` (Mis órdenes – Usuario)
- `GET /api/orderRoutes/admin/all` (Admin)
- `DELETE /api/orderRoutes/:id` (Admin)

---

### 👥 Usuarios
- `GET /api/userRoutes` (Admin)
- `PUT /api/userRoutes/:id` (Admin)
- `DELETE /api/userRoutes/:id` (Admin)

---

## 📧 Email Service

Se implementó un servicio de emails utilizando **Nodemailer** para:

- Verificación de email al registrarse
- Email de bienvenida
- Confirmación de órdenes
- Recuperación de contraseña

---

## ⚙️ Instalación y Ejecución

```bash
npm install
npm run dev
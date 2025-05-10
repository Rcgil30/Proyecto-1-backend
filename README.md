# Backend para Plataforma de Biblioteca Digital

API RESTful para la gestión de una biblioteca digital donde los usuarios pueden registrarse y reservar libros.

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB (Mongoose)
- JWT para autenticación
- bcryptjs para encriptación de contraseñas

## Estructura del proyecto

```
biblioteca-backend/
├── .env                     # Variables de entorno (no subir a GitHub)
├── .gitignore               # Ignora node_modules, .env, etc.
├── package.json             # Dependencias y scripts
├── README.md                # Documentación del proyecto
├── server.js                # Punto de entrada de la aplicación
│
├── config/
│   └── db.js                # Configuración de la base de datos
│
├── controllers/
│   ├── authController.js    # Controlador de autenticación
│   ├── bookController.js    # Controlador de libros
│   ├── reservationController.js # Controlador de reservas
│   └── userController.js    # Controlador de usuarios
│
├── middleware/
│   ├── authMiddleware.js    # Middleware de autenticación
│   └── permissionMiddleware.js # Middleware de permisos
│
├── models/
│   ├── Book.js              # Modelo de libros
│   ├── Reservation.js       # Modelo de reservas
│   └── User.js              # Modelo de usuarios
│
└── routes/
    ├── authRoutes.js        # Rutas de autenticación
    ├── bookRoutes.js        # Rutas de libros
    ├── reservationRoutes.js # Rutas de reservas
    └── userRoutes.js        # Rutas de usuarios
```

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd biblioteca-backend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Crear archivo `.env` basado en `.env.example`:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/biblioteca
   JWT_SECRET=tu_clave_secreta_jwt
   JWT_EXPIRE=30d
   ```

4. Iniciar el servidor:
   ```bash
   npm run dev
   ```

## Características principales

- Sistema de autenticación basado en JWT
- Gestión de usuarios con distintos niveles de permisos
- Operaciones CRUD para libros y usuarios
- Sistema de reserva de libros
- Historial de reservas
- Filtrado avanzado de libros
- Soft delete para protección de datos

## API Endpoints

### Autenticación

- `POST /api/auth/register` - Registrar un nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener datos del usuario actual (protegido)

### Usuarios

- `GET /api/users` - Obtener todos los usuarios (protegido)
- `PUT /api/users/:userId` - Actualizar un usuario (protegido)
- `DELETE /api/users/:userId` - Eliminar un usuario (soft delete) (protegido)

### Libros

- `GET /api/books` - Obtener todos los libros (con filtros opcionales)
- `GET /api/books/:bookId` - Obtener un libro específico
- `POST /api/books` - Crear un nuevo libro (protegido, requiere permiso)
- `PUT /api/books/:bookId` - Actualizar un libro (protegido, requiere permiso)
- `DELETE /api/books/:bookId` - Eliminar un libro (soft delete) (protegido, requiere permiso)

### Reservas

- `GET /api/reservations` - Obtener reservas del usuario actual (protegido)
- `GET /api/reservations/book/:bookId` - Obtener reservas de un libro específico (protegido)
- `POST /api/reservations` - Crear una nueva reserva (protegido)
- `PUT /api/reservations/:reservationId` - Devolver un libro (protegido)

## Sistema de permisos

Los usuarios pueden tener distintos permisos:
- `createBooks`: Permite crear libros
- `updateBooks`: Permite actualizar libros
- `deleteBooks`: Permite eliminar libros
- `updateUsers`: Permite modificar otros usuarios
- `deleteUsers`: Permite eliminar otros usuarios

## Filtrado de libros

La ruta `GET /api/books` acepta los siguientes parámetros de filtrado:
- `genre`: Filtrar por género
- `author`: Filtrar por autor
- `publisher`: Filtrar por editorial
- `title`: Filtrar por título
- `available`: Filtrar por disponibilidad (`true`/`false`)
- `publishedBefore`: Filtrar por fecha de publicación anterior a 
- `publishedAfter`: Filtrar por fecha de publicación posterior a
- `showInactive`: Incluir libros inactivos (`true`/`false`)
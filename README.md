# Disacomp Microservices Architecture & ERP

Este proyecto ERP está construido usando **NestJS** bajo los principios de **Arquitectura Hexagonal** y **Diseño Impulsado por el Dominio (DDD)** en el Backend, y **Vue 3 + Tailwind CSS v4** en el Frontend.

La solución consta de cuatro capas principales:
1. **Frontend (Vue SPA)**: Interfaz de usuario rica y reactiva, protegida por guardias de enrutamiento y estado global de sesión.
2. **Gateway (NestJS)**: API pública RESTful exponiendo la documentación Swagger interactiva, protegida por JWT y RBAC (`@Roles(...)`).
3. **Microservicio (NestJS)**: Lógica de negocio profunda segregada por módulos que procesa las reglas de dominio puras de la empresa e interactúa con la BD.
4. **RabbitMQ**: Message Broker encargado de la comunicación asíncrona robusta entre el Gateway y el Microservicio.

---

## 🛠 Requisitos Previos

1.  **Node.js**: v18 o superior.
2.  **Docker** y **Docker Compose**: instalados y corriendo, esenciales para la base de datos (MySQL) y la mensajería en cola (RabbitMQ).

---

## 🚀 Instalación y Despliegue Local Rápido

### 1. Levantar Infraestructura Base
Abre tu terminal en la carpeta principal del proyecto (`disacomp-4`) y levanta los contenedores:
```bash
docker-compose up -d
```
*(Esto iniciará MySQL en el puerto 3306 y RabbitMQ en 5672/15672)*

### 2. Levantar el Microservicio Core
Abre una nueva terminal y ejecuta:
```bash
cd microservice
npm install
npm run start:dev
```

### 3. Levantar el API Gateway
Abre una tercera terminal, separada de las anteriores, y ejecuta:
```bash
cd gateway
npm install
npm run start:dev
```
*(El Gateway iniciará y escuchará peticiones públicas en el puerto 3001)*

### 4. Poblar la Base de Datos (Seeding de Inicialización)
Para cargar datos iniciales ricos y poder usar el sistema de inmediato, realiza una petición al Gateway. Esto limpiará el esquema viejo y construirá un escenario idóneo:
```bash
curl -X POST http://localhost:3001/seed
```
*(También puedes ejecutar este POST desde Postman o Swagger)*

### 5. Levantar el App Frontend Web
Abre una cuarta terminal, dirígete hacia el front y lánzalo a través de Vite:
```bash
cd frontend
npm install
npm run dev
```
*(Visita el enlace local provisto por Vite, por defecto: http://localhost:5173)*

---

## 🔐 Autenticación y Credenciales (Importante)

El sistema completo funciona bloqueado hasta demostrar identidad mediante tokens web JSON (JWT).
Al ejecutar el Paso 4 (`/seed`), el sistema encripta y prepara las siguientes credenciales para que pruebes las vistas inmediatamente sin necesidad de registrarte:

**1. Administrador (Acceso y Visualización Total):**
- **Email:** `admin@disacomp.com`
- **Contraseña:** `admin123`

**2. Clientes (Acceso Limitado a Visualizar exclusivamente Sus Propias Facturas):**
- **Email:** `cliente1@correo.com` *(Hay 10 disponibles hasta `cliente10@correo.com`)*
- **Contraseña:** `cliente123`

---

## 📚 Módulos del Sistema Implementados

1. **Usuarios y Auth**: Generación y canje de autenticación, control de acceso basado en roles (ADMIN vs CLIENT) impidiendo fugas de datos de negocio.
2. **Clientes**: Gestión del directorio, nombres comerciales y RNCs de la cartera empresarial para asignar facturas.
3. **Productos**: Inventario básico valorizado con precios dinámicos asignables a iteraciones transaccionales.
4. **Facturas**: Ciclo de vida y carrito de compra con facturas compuestas por `InvoiceItems` (Relación M-a-M o 1-a-N). Generación automática de Reportes de Facturación consolidada en **PDF corporativo descargable**.

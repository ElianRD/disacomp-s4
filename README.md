# Disacomp Microservices Architecture

Este proyecto está construido usando **NestJS** bajo los principios de **Arquitectura Hexagonal** y **Diseño Impulsado por el Dominio (DDD)**. 

La solución consta de tres capas de infraestructura: un **Gateway** que actúa como API pública (con Swagger), un **Microservicio** que contiene la lógica de negocio aislada usando puertos y adaptadores, y **RabbitMQ** para la comunicación asíncrona entre ambos.

## 🛠 Requisitos Previos

1.  **Node.js**: v18 o superior.
2.  **Docker** y **Docker Compose**: instalados y corriendo, esenciales para la base de datos y la cola de mensajería.

---

## 🚀 Paso 1: Levantar la Infraestructura (Docker)

Antes de encender los servidores de Nest, necesitamos que RabbitMQ y MySQL estén corriendo en Docker.

1. Abre tu terminal en la carpeta principal del proyecto (`disacomp-4`).
2. Ejecuta:
   ```bash
   docker-compose up -d
   ```
3. Docker descargará e iniciará dos contenedores:
   * **`mysql_db`**: Base de datos corriendo en el puerto `3306`.
   * **`rabbitmq`**: RabbitMQ corriendo en el puerto `5672` (comunicación) y la interfaz de administrador en el puerto `15672`.

Puede tomar unos segundos para que la base de datos MySQL esté lista y acepte conexiones. Puedes verificar el estado en el administrador web de RabbitMQ: http://localhost:15672 (Credenciales por defecto de Docker: admin/admin o guest/guest, revisa tu config).

---

## ⚙️ Paso 2: Levantar el Microservicio

El microservicio es responsable de conectarse a la Base de Datos y ejecutar la lógica core del sistema.

1. Abre una **nueva pestaña** en tu terminal.
2. Navega a la carpeta del microservicio:
   ```bash
   cd microservice
   ```
3. Instala las dependencias (si aún no lo has hecho):
   ```bash
   npm install
   ```
4. Inicia el microservicio en modo desarrollo:
   ```bash
   npm run start:dev
   ```
5. Si ves un mensaje de confirmación de "TypeORM connection" y uno de que RabbitMQ se conectó exitosamente, vas por buen camino. El microservicio se iniciará en el puerto 3000 (o el que defina su ambiente).

---

## 🌐 Paso 3: Levantar el API Gateway

El Gateway es la puerta de cara al internet (o intranet). Recibe las peticiones HTTP, las expone vía Swagger y las envía por la red vía RabbitMQ al microservicio.

1. Abre una **tercera pestaña** en tu terminal (sin cerrar ni detener las anteriores).
2. Navega a la carpeta del gateway:
   ```bash
   cd gateway
   ```
3. Instala las dependencias (si aún no lo has hecho):
   ```bash
   npm install
   ```
4. Inicia el gateway en modo desarrollo:
   ```bash
   npm run start:dev
   ```
5. El Gateway debería iniciar exitosamente.

---

## 🧪 Paso 4: Probar la Arquitectura

### Medio 1: Swagger (La forma más fácil y visual)

La documentación automática e interactiva está activada usando Swagger en el Gateway.

1. Abre tu navegador web favorito.
2. Dirígete a: **`http://localhost:3001/api/docs`** (Ajusta el 3001 si tu Gateway usa un puerto distinto).
3. Verás la interfaz de Swagger listando todos los endpoints para **Clients** e **Invoices**.

**Flujo de prueba recomendado:**
1. Expande el endpoint `POST /clients`, haz clic en "Try it out", cambia los datos de ejemplo (por ejemplo, asegurate de que el RNC tenga 9 u 11 dígitos numéricos reales y el celular un formato válido) y presiona "Execute".
2. Copia el `id` (UUID) devuelto en la respuesta.
3. Expande el endpoint `POST /invoices`, pega el UUID que acabas de copiar en el campo `clientId`, pon montos válidos y presiona "Execute".
4. Usa el endpoint `GET /invoices/report/pdf` agregando un rango de fechas (`2020-01-01` a `2030-01-01`) para descargar **el PDF con el formato corporativo**.

### Medio 2: Ejemplos de Peticiones con cURL / Postman

Si prefieres usar la terminal o importar estos comandos a Postman, aquí tienes ejemplos concretos para todos los endpoints disponibles:

#### 👥 Módulo de Clientes (Clients)

**1. Crear un Cliente (POST)**
```bash
curl -X POST http://localhost:3001/clients \
-H "Content-Type: application/json" \
-d '{
  "name": "Empresa de Prueba SRL",
  "email": "contacto@pruebasrl.com",
  "phone": "809-555-5555",
  "rnc": "123456789"
}'
```

**2. Listar todos los Clientes (GET)**
```bash
curl -X GET http://localhost:3001/clients
```

**3. Obtener un Cliente Específico (GET)**
*(Sustituye la variable por un UUID real obtenido en el paso 2)*
```bash
curl -X GET http://localhost:3001/clients/SUSTITUIR-POR-ID-UUID
```

**4. Actualizar un Cliente (PUT)**
```bash
curl -X PUT http://localhost:3001/clients/SUSTITUIR-POR-ID-UUID \
-H "Content-Type: application/json" \
-d '{
  "name": "Empresa de Prueba Actualizada",
  "phone": "809-111-2222"
}'
```

**5. Eliminar un Cliente (DELETE)**
```bash
curl -X DELETE http://localhost:3001/clients/SUSTITUIR-POR-ID-UUID
```

---

#### 🧾 Módulo de Facturas (Invoices)

**1. Crear una Factura (POST)**
*(Requiere que ya exista un cliente. Usa su ID aquí)*
```bash
curl -X POST http://localhost:3001/invoices \
-H "Content-Type: application/json" \
-d '{
  "clientId": "SUSTITUIR-POR-ID-DEL-CLIENTE",
  "subTotal": 1000.00,
  "tax": 180.00,
  "total": 1180.00,
  "status": "PAID"
}'
```

**2. Listar todas las Facturas (GET)**
```bash
curl -X GET http://localhost:3001/invoices
```

**3. Obtener el Reporte en PDF (GET)**
*(Abre la URL en tu navegador web normal para descargar el archivo)*
```
http://localhost:3001/invoices/report/pdf?startDate=2024-01-01&endDate=2030-12-31
```

**4. Obtener una Factura Específica (GET)**
```bash
curl -X GET http://localhost:3001/invoices/SUSTITUIR-POR-ID-UUID
```

---

## 🛑 Detener el Entorno

Cuando termines de trabajar:
1. En la terminal del Gateway presiona `Ctrl + C`.
2. En la terminal del Microservicio presiona `Ctrl + C`.
3. Ve a la consola raíz y apaga los contenedores (esto mantendrá la data gracias a los volúmenes configurados):
   ```bash
   docker-compose down
   ```
   *Nota: Si prefieres borrar también la data de la DB local para un inicio fresco, usa `docker-compose down -v`.*

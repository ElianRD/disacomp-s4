# Guía: Sistema de Microservicios con NestJS + RabbitMQ

## Estado actual del proyecto
- ✅ [docker-compose.yml](file:///d:/escritorio/disacomp-4/docker-compose.yml) ya está creado (RabbitMQ + MySQL)
- ✅ Proyecto `microservice` NestJS ya existe con dependencias instaladas
- ❌ Falta configurar el microservicio con DDD
- ❌ Falta crear el `gateway`

---

## PASO 1 — Levantar la infraestructura Docker

Ejecuta esto en la raíz del proyecto (`d:\escritorio\disacomp-4`):

```bash
docker compose up -d
```

Verifica que ambos contenedores estén corriendo:
```bash
docker ps
```

- RabbitMQ UI → [http://localhost:15672](http://localhost:15672) (user: `guest`, pass: `guest`)
- MySQL en puerto `3306`, base de datos `disacomp_db`

---

## PASO 2 — Configurar el Microservicio

### 2.1 Estructura de carpetas a crear

Dentro de `microservice/src/`, crea la siguiente estructura:

```
src/
└── modules/
    ├── clients/
    │   ├── application/
    │   │   ├── create-client.use-case.ts
    │   │   ├── find-all-clients.use-case.ts
    │   │   ├── find-client.use-case.ts
    │   │   ├── update-client.use-case.ts
    │   │   └── delete-client.use-case.ts
    │   ├── domain/
    │   │   ├── client.entity.ts
    │   │   ├── rnc.value-object.ts
    │   │   └── client.repository.ts
    │   ├── infrastructure/
    │   │   ├── client.orm-entity.ts
    │   │   └── typeorm-client.repository.ts
    │   ├── clients.controller.ts
    │   └── clients.module.ts
    │
    └── invoices/
        ├── application/
        │   ├── create-invoice.use-case.ts
        │   ├── find-all-invoices.use-case.ts
        │   ├── find-invoice.use-case.ts
        │   ├── update-invoice.use-case.ts
        │   ├── delete-invoice.use-case.ts
        │   └── get-sales-report.use-case.ts
        ├── domain/
        │   ├── invoice.entity.ts
        │   └── invoice.repository.ts
        ├── infrastructure/
        │   ├── invoice.orm-entity.ts
        │   └── typeorm-invoice.repository.ts
        ├── invoices.controller.ts
        └── invoices.module.ts
```

---

### 2.2 Configurar `main.ts` (modo microservicio RabbitMQ)

```typescript
// microservice/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@localhost:5672'],
        queue: 'main_queue',
        queueOptions: { durable: false },
      },
    },
  );
  await app.listen();
  console.log('Microservicio escuchando en RabbitMQ...');
}
bootstrap();
```

---

### 2.3 Configurar `AppModule` con TypeORM

```typescript
// microservice/src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from './modules/clients/clients.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { ClientOrmEntity } from './modules/clients/infrastructure/client.orm-entity';
import { InvoiceOrmEntity } from './modules/invoices/infrastructure/invoice.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'disacomp_db',
      entities: [ClientOrmEntity, InvoiceOrmEntity],
      synchronize: true, // solo en desarrollo
    }),
    ClientsModule,
    InvoicesModule,
  ],
})
export class AppModule {}
```

---

### 2.4 Domain — Clientes

**Value Object RNC** (`domain/rnc.value-object.ts`):
```typescript
export class Rnc {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('El RNC no puede estar vacío');
    }
    // RNC dominicano: 9 u 11 dígitos
    if (!/^\d{9}(\d{2})?$/.test(value.trim())) {
      throw new Error('RNC inválido');
    }
    this.value = value.trim();
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Rnc): boolean {
    return this.value === other.value;
  }
}
```

**Entidad Client** (`domain/client.entity.ts`):
```typescript
import { Rnc } from './rnc.value-object';

export class Client {
  constructor(
    public readonly id: string,
    public nombre: string,
    public rnc: Rnc,
    public direccion: string,
    public telefono: string,
  ) {}

  static create(props: {
    id: string;
    nombre: string;
    rnc: string;
    direccion: string;
    telefono: string;
  }): Client {
    return new Client(
      props.id,
      props.nombre,
      new Rnc(props.rnc),
      props.direccion,
      props.telefono,
    );
  }
}
```

**Interfaz Repositorio** (`domain/client.repository.ts`):
```typescript
import { Client } from './client.entity';

export abstract class ClientRepository {
  abstract save(client: Client): Promise<void>;
  abstract findAll(): Promise<Client[]>;
  abstract findById(id: string): Promise<Client | null>;
  abstract update(client: Client): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
```

---

### 2.5 Infrastructure — Clientes

**ORM Entity** (`infrastructure/client.orm-entity.ts`):
```typescript
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('clients')
export class ClientOrmEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  nombre: string;

  @Column({ unique: true })
  rnc: string;

  @Column()
  direccion: string;

  @Column()
  telefono: string;
}
```

**Repositorio TypeORM** (`infrastructure/typeorm-client.repository.ts`):
```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientRepository } from '../domain/client.repository';
import { Client } from '../domain/client.entity';
import { ClientOrmEntity } from './client.orm-entity';

@Injectable()
export class TypeOrmClientRepository extends ClientRepository {
  constructor(
    @InjectRepository(ClientOrmEntity)
    private readonly repo: Repository<ClientOrmEntity>,
  ) {
    super();
  }

  async save(client: Client): Promise<void> {
    await this.repo.save({
      id: client.id,
      nombre: client.nombre,
      rnc: client.rnc.getValue(),
      direccion: client.direccion,
      telefono: client.telefono,
    });
  }

  async findAll(): Promise<Client[]> {
    const entities = await this.repo.find();
    return entities.map((e) => Client.create(e));
  }

  async findById(id: string): Promise<Client | null> {
    const e = await this.repo.findOneBy({ id });
    if (!e) return null;
    return Client.create(e);
  }

  async update(client: Client): Promise<void> {
    await this.repo.update(client.id, {
      nombre: client.nombre,
      rnc: client.rnc.getValue(),
      direccion: client.direccion,
      telefono: client.telefono,
    });
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
```

---

### 2.6 Application — Casos de uso de Clientes

**Create** (`application/create-client.use-case.ts`):
```typescript
import { Injectable } from '@nestjs/common';
import { ClientRepository } from '../domain/client.repository';
import { Client } from '../domain/client.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateClientUseCase {
  constructor(private readonly repo: ClientRepository) {}

  async execute(dto: {
    nombre: string;
    rnc: string;
    direccion: string;
    telefono: string;
  }): Promise<void> {
    const client = Client.create({ id: uuidv4(), ...dto });
    await this.repo.save(client);
  }
}
```

> Los demás (FindAll, FindOne, Update, Delete) siguen el mismo patrón:
> reciben un DTO, llaman al repositorio y devuelven el resultado.

---

### 2.7 Controller del Microservicio — Clientes

```typescript
// clients.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateClientUseCase } from './application/create-client.use-case';
import { FindAllClientsUseCase } from './application/find-all-clients.use-case';
// ...importa el resto

@Controller()
export class ClientsController {
  constructor(
    private readonly createClient: CreateClientUseCase,
    private readonly findAllClients: FindAllClientsUseCase,
    // ... inyecta el resto
  ) {}

  @MessagePattern('create_client')
  async create(@Payload() data: any) {
    await this.createClient.execute(data);
    return { success: true };
  }

  @MessagePattern('find_all_clients')
  async findAll() {
    return this.findAllClients.execute();
  }

  @MessagePattern('find_client')
  async findOne(@Payload() data: { id: string }) {
    return this.findOneClient.execute(data.id);
  }

  @MessagePattern('update_client')
  async update(@Payload() data: any) {
    await this.updateClient.execute(data);
    return { success: true };
  }

  @MessagePattern('delete_client')
  async delete(@Payload() data: { id: string }) {
    await this.deleteClient.execute(data.id);
    return { success: true };
  }
}
```

> ⚠️ Los `@MessagePattern` deben coincidir exactamente con los que usará el Gateway.

---

### 2.8 ClientsModule

```typescript
// clients.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientOrmEntity } from './infrastructure/client.orm-entity';
import { TypeOrmClientRepository } from './infrastructure/typeorm-client.repository';
import { ClientRepository } from './domain/client.repository';
import { ClientsController } from './clients.controller';
import { CreateClientUseCase } from './application/create-client.use-case';
import { FindAllClientsUseCase } from './application/find-all-clients.use-case';
// ...importa el resto de use cases

@Module({
  imports: [TypeOrmModule.forFeature([ClientOrmEntity])],
  controllers: [ClientsController],
  providers: [
    { provide: ClientRepository, useClass: TypeOrmClientRepository },
    CreateClientUseCase,
    FindAllClientsUseCase,
    // ...agrega el resto de use cases
  ],
})
export class ClientsModule {}
```

---

### 2.9 Módulo Invoices

Sigue el **mismo patrón** que Clients. Lo relevante de Invoice:

**Entidad** (`domain/invoice.entity.ts`):
```typescript
export class Invoice {
  constructor(
    public readonly id: string,
    public numeroFactura: string,
    public clienteId: string,
    public fecha: Date,
    public total: number,
    public estado: string,
  ) {}

  static create(props: {
    id: string;
    numeroFactura: string;
    clienteId: string;
    fecha: Date;
    total: number;
    estado: string;
  }): Invoice {
    return new Invoice(
      props.id, props.numeroFactura, props.clienteId,
      props.fecha, props.total, props.estado,
    );
  }
}
```

**ORM Entity** (`infrastructure/invoice.orm-entity.ts`):
```typescript
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('invoices')
export class InvoiceOrmEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  numeroFactura: string;

  @Column()
  clienteId: string;

  @Column()
  fecha: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({ default: 'activa' })
  estado: string;
}
```

**Message Patterns del controller**:
- `create_invoice`
- `find_all_invoices`
- `find_invoice`
- `update_invoice`
- `delete_invoice`
- `get_sales_report` → recibe `{ startDate, endDate }`, devuelve resumen

**Caso de uso reporte** (`application/get-sales-report.use-case.ts`):
```typescript
@Injectable()
export class GetSalesReportUseCase {
  constructor(private readonly repo: InvoiceRepository) {}

  async execute(startDate: Date, endDate: Date) {
    const invoices = await this.repo.findByDateRange(startDate, endDate);
    const total = invoices.reduce((sum, i) => sum + Number(i.total), 0);
    return {
      startDate,
      endDate,
      count: invoices.length,
      totalAmount: total,
      invoices,
    };
  }
}
```

---

## PASO 3 — Crear el Gateway

### 3.1 Crear el proyecto Gateway

En la carpeta raíz `d:\escritorio\disacomp-4`:
```bash
npx @nestjs/cli new gateway --skip-git --package-manager npm
```

### 3.2 Instalar dependencias RabbitMQ en Gateway

```bash
cd gateway
npm install @nestjs/microservices amqplib amqp-connection-manager
```

Para el PDF:
```bash
npm install pdfkit
npm install --save-dev @types/pdfkit
```

### 3.3 Configurar `AppModule` del Gateway

```typescript
// gateway/src/app.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule } from './modules/clients/clients.module';
import { InvoicesModule } from './modules/invoices/invoices.module';

@Module({
  imports: [ClientsModule, InvoicesModule],
})
export class AppModule {}
```

### 3.4 Módulo Clients en el Gateway

Estructura:
```
gateway/src/modules/clients/
├── clients.controller.ts   ← recibe HTTP
├── clients.service.ts      ← envía a RabbitMQ
└── clients.module.ts
```

**clients.module.ts**:
```typescript
import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { ClientsModule as NestClientsModule } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';

@Module({
  imports: [
    NestClientsModule.register({
      name: 'MAIN_SERVICE',
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@localhost:5672'],
        queue: 'main_queue',
        queueOptions: { durable: false },
      },
    }),
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
```

**clients.service.ts**:
```typescript
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ClientsService {
  constructor(@Inject('MAIN_SERVICE') private readonly client: ClientProxy) {}

  async create(data: any) {
    return firstValueFrom(this.client.send('create_client', data));
  }

  async findAll() {
    return firstValueFrom(this.client.send('find_all_clients', {}));
  }

  async findOne(id: string) {
    return firstValueFrom(this.client.send('find_client', { id }));
  }

  async update(id: string, data: any) {
    return firstValueFrom(this.client.send('update_client', { id, ...data }));
  }

  async remove(id: string) {
    return firstValueFrom(this.client.send('delete_client', { id }));
  }
}
```

**clients.controller.ts**:
```typescript
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(@Body() body: any) {
    return this.clientsService.create(body);
  }

  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.clientsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}
```

> El módulo `invoices` en el Gateway sigue el **mismo patrón** exacto.

---

## PASO 4 — Reporte PDF en el Gateway

En el controller de invoices del Gateway, agrega:

```typescript
import { Res, Query } from '@nestjs/common';
import { Response } from 'express';
import * as PDFDocument from 'pdfkit';

@Get('report/pdf')
async getPdfReport(
  @Query('startDate') startDate: string,
  @Query('endDate') endDate: string,
  @Res() res: Response,
) {
  const report = await this.invoicesService.getSalesReport(startDate, endDate);

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=reporte.pdf');
  doc.pipe(res);

  doc.fontSize(18).text('Reporte de Ventas', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Desde: ${startDate}  Hasta: ${endDate}`);
  doc.text(`Total facturas: ${report.count}`);
  doc.text(`Monto total: $${report.totalAmount}`);
  doc.moveDown();
  doc.text('Facturas:');
  report.invoices.forEach((inv: any) => {
    doc.text(`  - #${inv.numeroFactura} | ${inv.fecha} | $${inv.total} | ${inv.estado}`);
  });

  doc.end();
}
```

---

## PASO 5 — Ejecutar todo

### Terminal 1 — Microservicio
```bash
cd d:\escritorio\disacomp-4\microservice
npm run start:dev
```

### Terminal 2 — Gateway
```bash
cd d:\escritorio\disacomp-4\gateway
npm run start:dev
```

> El Gateway corre en puerto **3000** por defecto.

---

## PASO 6 — Probar el sistema

| Acción | Método | URL |
|---|---|---|
| Crear cliente | POST | `http://localhost:3000/clients` |
| Listar clientes | GET | `http://localhost:3000/clients` |
| Ver cliente | GET | `http://localhost:3000/clients/:id` |
| Actualizar cliente | PUT | `http://localhost:3000/clients/:id` |
| Eliminar cliente | DELETE | `http://localhost:3000/clients/:id` |
| Crear factura | POST | `http://localhost:3000/invoices` |
| Listar facturas | GET | `http://localhost:3000/invoices` |
| Reporte PDF | GET | `http://localhost:3000/invoices/report/pdf?startDate=2025-01-01&endDate=2025-12-31` |

**Body ejemplo para crear cliente:**
```json
{
  "nombre": "Empresa ABC",
  "rnc": "101234567",
  "direccion": "Calle 1, Santo Domingo",
  "telefono": "809-555-1234"
}
```

**Body ejemplo para crear factura:**
```json
{
  "numeroFactura": "FAC-001",
  "clienteId": "<uuid del cliente>",
  "fecha": "2025-03-01",
  "total": 5500.00,
  "estado": "pagada"
}
```

---

## Resumen del flujo de datos

```
Postman/Browser
      ↓ HTTP POST /clients
Gateway (puerto 3000)
      ↓ RabbitMQ → cola "main_queue" → mensaje "create_client"
Microservicio
      ↓ ClientsController @MessagePattern('create_client')
      ↓ CreateClientUseCase.execute()
      ↓ Client.create() (dominio)
      ↓ TypeOrmClientRepository.save()
      ↓ MySQL (tabla clients)
      ↑ respuesta sube por el mismo camino
Gateway responde al cliente HTTP
```

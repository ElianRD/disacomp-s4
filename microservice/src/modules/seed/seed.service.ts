import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ClientOrmEntity } from '../clients/infrastructure/persistence/entities/client.orm-entity';
import { InvoiceOrmEntity } from '../invoices/infrastructure/persistence/entities/invoice.orm-entity';
import { ProductOrmEntity } from '../products/infrastructure/persistence/entities/product.orm-entity';
import { UserOrmEntity } from '../users/infrastructure/persistence/entities/user.orm-entity';
import { CreateUserUseCase } from '../users/application/use-cases/create-user.use-case';
import { UserRole } from '../users/domain/entities/user.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(ClientOrmEntity)
    private readonly clientRepo: Repository<ClientOrmEntity>,
    @InjectRepository(InvoiceOrmEntity)
    private readonly invoiceRepo: Repository<InvoiceOrmEntity>,
    @InjectRepository(ProductOrmEntity)
    private readonly productRepo: Repository<ProductOrmEntity>,
    @InjectRepository(UserOrmEntity)
    private readonly userRepo: Repository<UserOrmEntity>,
    private readonly createUserUC: CreateUserUseCase,
  ) {}

  async runSeed() {
    this.logger.log('Starting execution of database seeding...');

    // 1. Limpiar base de datos (Opcional, pero recomendado para semillas idempotentes)
    await this.invoiceRepo.query('DELETE FROM invoice_items');
    await this.invoiceRepo.query('DELETE FROM invoices');
    await this.productRepo.query('DELETE FROM products');
    await this.userRepo.query('DELETE FROM users');
    await this.clientRepo.query('DELETE FROM clients');

    // 2. Crear Admin e inyectarlo en DB
    await this.createUserUC.execute({
      email: 'admin@disacomp.com',
      passwordRaw: 'admin123',
      role: UserRole.ADMIN,
    });
    this.logger.log('Inserted ADMIN user (admin@disacomp.com / admin123).');

    // 3. Crear 10 Clientes y sus 10 Usuarios de Acceso
    const clients: ClientOrmEntity[] = [];
    const clientIds: string[] = [];

    for (let i = 1; i <= 10; i++) {
        const id = uuidv4();
        clientIds.push(id);
        const newClient = this.clientRepo.create({
            id: id,
            nombre: `Empresa Cliente ${i} SRL`,
            rnc: `101000${i.toString().padStart(3, '0')}`,
            direccion: `Calle Principal ${i}, Santo Domingo`,
            telefono: `809-555-${i.toString().padStart(4, '0')}`
        });
        clients.push(newClient);
    }
    await this.clientRepo.save(clients);
    
    for (let i = 0; i < clients.length; i++) {
        const username = `cliente${i + 1}@correo.com`;
        await this.createUserUC.execute({
           email: username,
           passwordRaw: 'cliente123',
           role: UserRole.CLIENT,
           clientId: clients[i].id
        });
    }
    this.logger.log(`Inserted ${clients.length} test clients and their respective Login Credentials.`);

    // 4. Crear 100 Productos
    const products: ProductOrmEntity[] = [];
    const productData: any[] = [];
    const categories = ['Monitor', 'Teclado', 'Mouse', 'Laptop', 'Impresora', 'Disco Duro', 'Memoria RAM', 'Cable', 'Cámara', 'Audífonos'];

    for (let i = 1; i <= 100; i++) {
        const id = uuidv4();
        const category = categories[i % categories.length];
        const price = Math.floor(Math.random() * (2000 - 10) + 10); // Precio entre 10 y 2000
        
        const prod = {
            id: id,
            name: `${category} Modelo X${i}`,
            desc: `Descripción genérica del ${category} numero ${i}`,
            price: price,
            stock: Math.floor(Math.random() * 100) + 5,
            sku: `SKU-${category.substring(0,3).toUpperCase()}-${i.toString().padStart(4, '0')}`
        };
        productData.push(prod);

        products.push(this.productRepo.create({
            id: prod.id,
            name: prod.name,
            description: prod.desc,
            price: prod.price,
            stock: prod.stock,
            sku: prod.sku
        }));
    }
    await this.productRepo.save(products);
    this.logger.log(`Inserted ${products.length} test products.`);

    // 5. Crear Facturas (1 por cada cliente)
    const invoices: InvoiceOrmEntity[] = [];
    
    // Función auxiliar para calcular items manuales (pues TypeORM guarda ORM directo)
    const createItem = (invId: string, prodIndex: number, qty: number) => {
      const prod = productData[prodIndex];
      return {
        id: uuidv4(),
        invoiceId: invId,
        productId: prod.id,
        quantity: qty,
        unitPrice: prod.price,
        subTotal: prod.price * qty
      };
    };

    // Crear 1 Factura por cada cliente (10 facturas)
    for (let i = 0; i < 10; i++) {
        const invId = uuidv4();
        const clientId = clientIds[i];
        
        // Cantidad aleatoria de items para esta factura (entre 1 y 4 items diferentes)
        const itemsCount = Math.floor(Math.random() * 4) + 1;
        const invItems: any[] = [];
        
        for (let j = 0; j < itemsCount; j++) {
            // Seleccionar un producto al azar usando su indice (0-99)
            const randomProdIndex = Math.floor(Math.random() * 100);
            const qty = Math.floor(Math.random() * 5) + 1; // cantidad a comprar entre 1 y 5
            
            // Validar que no se agregue el mismo producto 2 veces en la misma iteracion de factura
            if (!invItems.find(item => item.productId === productData[randomProdIndex].id)) {
                invItems.push(createItem(invId, randomProdIndex, qty));
            }
        }

        const invSubTotal = invItems.reduce((acc, curr) => acc + curr.subTotal, 0);
        const statuses = ['PAID', 'PENDING', 'CANCELLED'];
        
        invoices.push(this.invoiceRepo.create({
            id: invId,
            invoiceNumber: 'INV-' + Date.now().toString() + `-${i+1}`,
            clientId: clientId,
            date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)), // Fecha aleatoria en el pasado cercano
            total: invSubTotal + (invSubTotal * 0.18),
            status: statuses[i % statuses.length],
            items: invItems as any
        }));
    }

    await this.invoiceRepo.save(invoices);
    this.logger.log(`Inserted ${invoices.length} test invoices with items.`);

    this.logger.log('Database seeding completed successfully ✅');
    return { message: 'Database seeded successfully', clientsInserted: clients.length, productsInserted: products.length, invoicesInserted: invoices.length, usersInserted: clients.length + 1 };
  }
}

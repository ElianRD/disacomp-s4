import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Infrastructure — Persistence
import { InvoiceOrmEntity } from './infrastructure/persistence/entities/invoice.orm-entity';
import { InvoiceItemOrmEntity } from './infrastructure/persistence/entities/invoice-item.orm-entity';
import { InvoiceRepository } from './infrastructure/persistence/repositories/invoice.repository';

// External Modules
import { ProductsModule } from '../products/products.module';

// Infrastructure — Messaging
import { InvoiceEventPublisher } from './infrastructure/messaging/publishers/invoice-event.publisher';
import { InvoiceEventConsumer } from './infrastructure/messaging/consumers/invoice-event.consumer';

// Infrastructure — HTTP
import { InvoiceController } from './infrastructure/http/controllers/invoice.controller';

// Application — Use Cases
import { CreateInvoiceUseCase } from './application/use-cases/create-invoice.use-case';
import { ListInvoicesUseCase } from './application/use-cases/list-invoices.use-case';
import { GetInvoiceUseCase } from './application/use-cases/get-invoice.use-case';
import { UpdateInvoiceUseCase } from './application/use-cases/update-invoice.use-case';
import { DeleteInvoiceUseCase } from './application/use-cases/delete-invoice.use-case';
import { GetSalesReportUseCase } from './application/use-cases/get-sales-report.use-case';

// Ports tokens
import { INVOICE_REPOSITORY } from './domain/repositories/invoice.repository.interface';
import { INVOICE_EVENT_PUBLISHER } from './application/ports/output/invoice-event-publisher.port';

@Module({
  imports: [
    TypeOrmModule.forFeature([InvoiceOrmEntity, InvoiceItemOrmEntity]),
    ProductsModule,
  ],
  controllers: [InvoiceController, InvoiceEventConsumer],
  providers: [
    // Repository binding
    { provide: INVOICE_REPOSITORY, useClass: InvoiceRepository },
    // Event publisher binding
    { provide: INVOICE_EVENT_PUBLISHER, useClass: InvoiceEventPublisher },
    // Use Cases
    CreateInvoiceUseCase,
    ListInvoicesUseCase,
    GetInvoiceUseCase,
    UpdateInvoiceUseCase,
    DeleteInvoiceUseCase,
    GetSalesReportUseCase,
  ],
})
export class InvoicesModule {}

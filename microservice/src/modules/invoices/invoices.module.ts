import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesController } from './invoices.controller';
import { InvoiceOrmEntity } from './infrastructure/invoice.orm-entity';
import { TypeOrmInvoiceRepository } from './infrastructure/typeorm-invoice.repository';
import { INVOICE_REPOSITORY } from './domain/invoice.repository';
import { CreateInvoiceUseCase } from './application/create-invoice.use-case';
import { FindAllInvoicesUseCase } from './application/find-all-invoices.use-case';
import { FindInvoiceUseCase } from './application/find-invoice.use-case';
import { UpdateInvoiceUseCase } from './application/update-invoice.use-case';
import { DeleteInvoiceUseCase } from './application/delete-invoice.use-case';
import { GetSalesReportUseCase } from './application/get-sales-report.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceOrmEntity])],
  controllers: [InvoicesController],
  providers: [
    {
      provide: INVOICE_REPOSITORY,
      useClass: TypeOrmInvoiceRepository,
    },
    CreateInvoiceUseCase,
    FindAllInvoicesUseCase,
    FindInvoiceUseCase,
    UpdateInvoiceUseCase,
    DeleteInvoiceUseCase,
    GetSalesReportUseCase,
  ],
})
export class InvoicesModule {}

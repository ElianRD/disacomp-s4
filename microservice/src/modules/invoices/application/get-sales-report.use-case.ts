import { Injectable, Inject } from '@nestjs/common';
import { INVOICE_REPOSITORY, type InvoiceRepository } from '../domain/invoice.repository';

@Injectable()
export class GetSalesReportUseCase {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  async execute(startDate: Date, endDate: Date): Promise<any> {
    const invoices = await this.invoiceRepository.findByDateRange(startDate, endDate);
    
    // Calcular el total
    const totalSales = invoices.reduce((acc, current) => {
        // En TypeORM los decimales suelen venir como strings dependiendo de la config
        return acc + Number(current.total);
    }, 0);

    return {
      startDate,
      endDate,
      totalInvoices: invoices.length,
      totalSales,
      invoices,
    };
  }
}

import { Injectable, Inject } from '@nestjs/common';
import type { IInvoiceRepository } from '../../domain/repositories/invoice.repository.interface';
import { INVOICE_REPOSITORY } from '../../domain/repositories/invoice.repository.interface';
import { SalesReportResponseDto } from '../dtos/invoice-response.dto';
import { InvoiceApplicationMapper } from '../mappers/invoice-application.mapper';

@Injectable()
export class GetSalesReportUseCase {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepository: IInvoiceRepository,
  ) {}

  async execute(startDate: Date, endDate: Date): Promise<SalesReportResponseDto> {
    const invoices = await this.invoiceRepository.findByDateRange(startDate, endDate);

    const totalSales = invoices.reduce((acc, inv) => acc + Number(inv.total), 0);

    return {
      startDate,
      endDate,
      totalInvoices: invoices.length,
      totalSales: Math.round(totalSales * 100) / 100,
      invoices: invoices.map(InvoiceApplicationMapper.toResponse),
    };
  }
}

import { Injectable, Inject } from '@nestjs/common';
import { INVOICE_REPOSITORY, type InvoiceRepository } from '../domain/invoice.repository';
import { Invoice } from '../domain/invoice.entity';

@Injectable()
export class FindAllInvoicesUseCase {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  async execute(): Promise<Invoice[]> {
    return this.invoiceRepository.findAll();
  }
}

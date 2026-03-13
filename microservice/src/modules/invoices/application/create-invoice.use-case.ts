import { Injectable, Inject } from '@nestjs/common';
import { INVOICE_REPOSITORY, type InvoiceRepository } from '../domain/invoice.repository';
import { Invoice } from '../domain/invoice.entity';

@Injectable()
export class CreateInvoiceUseCase {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  async execute(data: {
    invoiceNumber: string;
    clientId: number;
    date: Date;
    total: number;
    status: string;
  }): Promise<Invoice> {
    return this.invoiceRepository.create(data);
  }
}

import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { INVOICE_REPOSITORY, type InvoiceRepository } from '../domain/invoice.repository';
import { Invoice } from '../domain/invoice.entity';

@Injectable()
export class UpdateInvoiceUseCase {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  async execute(id: number, data: Partial<Invoice>): Promise<Invoice> {
    const existingInvoice = await this.invoiceRepository.findById(id);
    if (!existingInvoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return this.invoiceRepository.update(id, data);
  }
}

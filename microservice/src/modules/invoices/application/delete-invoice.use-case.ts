import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { INVOICE_REPOSITORY, type InvoiceRepository } from '../domain/invoice.repository';

@Injectable()
export class DeleteInvoiceUseCase {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const existingInvoice = await this.invoiceRepository.findById(id);
    if (!existingInvoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    await this.invoiceRepository.delete(id);
  }
}

import { Injectable, Inject } from '@nestjs/common';
import type { IInvoiceRepository } from '../../domain/repositories/invoice.repository.interface';
import { INVOICE_REPOSITORY } from '../../domain/repositories/invoice.repository.interface';
import type { IInvoiceEventPublisher } from '../ports/output/invoice-event-publisher.port';
import { INVOICE_EVENT_PUBLISHER } from '../ports/output/invoice-event-publisher.port';
import { InvoiceNotFoundException } from '../../domain/exceptions/invoice-not-found.exception';

@Injectable()
export class DeleteInvoiceUseCase {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepository: IInvoiceRepository,
    @Inject(INVOICE_EVENT_PUBLISHER)
    private readonly eventPublisher: IInvoiceEventPublisher,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.invoiceRepository.findById(id);
    if (!existing) throw new InvoiceNotFoundException(id);

    existing.markAsDeleted();

    await this.invoiceRepository.delete(id);

    for (const event of existing.domainEvents) {
      await this.eventPublisher.publish(event);
    }
  }
}

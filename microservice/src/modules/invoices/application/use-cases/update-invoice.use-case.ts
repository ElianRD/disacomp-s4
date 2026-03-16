import { Injectable, Inject } from '@nestjs/common';
import type { IInvoiceRepository } from '../../domain/repositories/invoice.repository.interface';
import { INVOICE_REPOSITORY } from '../../domain/repositories/invoice.repository.interface';
import type { IInvoiceEventPublisher } from '../ports/output/invoice-event-publisher.port';
import { INVOICE_EVENT_PUBLISHER } from '../ports/output/invoice-event-publisher.port';
import { UpdateInvoiceDto } from '../dtos/update-invoice.dto';
import { InvoiceResponseDto } from '../dtos/invoice-response.dto';
import { InvoiceApplicationMapper } from '../mappers/invoice-application.mapper';
import { InvoiceNotFoundException } from '../../domain/exceptions/invoice-not-found.exception';

@Injectable()
export class UpdateInvoiceUseCase {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepository: IInvoiceRepository,
    @Inject(INVOICE_EVENT_PUBLISHER)
    private readonly eventPublisher: IInvoiceEventPublisher,
  ) {}

  async execute(id: string, dto: UpdateInvoiceDto): Promise<InvoiceResponseDto> {
    const existing = await this.invoiceRepository.findById(id);
    if (!existing) throw new InvoiceNotFoundException(id);

    existing.update(dto);

    const updated = await this.invoiceRepository.save(existing);

    for (const event of existing.domainEvents) {
      await this.eventPublisher.publish(event);
    }

    return InvoiceApplicationMapper.toResponse(updated);
  }
}

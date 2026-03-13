import { Injectable, Inject } from '@nestjs/common';
import type { IInvoiceRepository } from '../../domain/repositories/invoice.repository.interface';
import { INVOICE_REPOSITORY } from '../../domain/repositories/invoice.repository.interface';
import type { IInvoiceEventPublisher } from '../ports/output/invoice-event-publisher.port';
import { INVOICE_EVENT_PUBLISHER } from '../ports/output/invoice-event-publisher.port';
import { CreateInvoiceDto } from '../dtos/create-invoice.dto';
import { InvoiceResponseDto } from '../dtos/invoice-response.dto';
import { InvoiceApplicationMapper } from '../mappers/invoice-application.mapper';
import { InvoiceAlreadyExistsException } from '../../domain/exceptions/invoice-already-exists.exception';

@Injectable()
export class CreateInvoiceUseCase {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepository: IInvoiceRepository,
    @Inject(INVOICE_EVENT_PUBLISHER)
    private readonly eventPublisher: IInvoiceEventPublisher,
  ) {}

  async execute(dto: CreateInvoiceDto): Promise<InvoiceResponseDto> {
    const existing = await this.invoiceRepository.findByInvoiceNumber(dto.invoiceNumber);
    if (existing) {
      throw new InvoiceAlreadyExistsException(dto.invoiceNumber);
    }

    const invoice = await this.invoiceRepository.create(dto as any);

    for (const event of invoice.domainEvents) {
      await this.eventPublisher.publish(event);
    }

    return InvoiceApplicationMapper.toResponse(invoice);
  }
}

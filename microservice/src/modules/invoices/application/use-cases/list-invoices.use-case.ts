import { Injectable, Inject } from '@nestjs/common';
import type { IInvoiceRepository } from '../../domain/repositories/invoice.repository.interface';
import { INVOICE_REPOSITORY } from '../../domain/repositories/invoice.repository.interface';
import { InvoiceResponseDto } from '../dtos/invoice-response.dto';
import { InvoiceApplicationMapper } from '../mappers/invoice-application.mapper';

@Injectable()
export class ListInvoicesUseCase {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepository: IInvoiceRepository,
  ) {}

  async execute(clientId?: string): Promise<InvoiceResponseDto[]> {
    const invoices = await this.invoiceRepository.findAll(clientId);
    return invoices.map(InvoiceApplicationMapper.toResponse);
  }
}

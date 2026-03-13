import { Injectable, Inject } from '@nestjs/common';
import type { IInvoiceRepository } from '../../domain/repositories/invoice.repository.interface';
import { INVOICE_REPOSITORY } from '../../domain/repositories/invoice.repository.interface';
import { InvoiceResponseDto } from '../dtos/invoice-response.dto';
import { InvoiceApplicationMapper } from '../mappers/invoice-application.mapper';
import { InvoiceNotFoundException } from '../../domain/exceptions/invoice-not-found.exception';

@Injectable()
export class GetInvoiceUseCase {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepository: IInvoiceRepository,
  ) {}

  async execute(id: string): Promise<InvoiceResponseDto> {
    const invoice = await this.invoiceRepository.findById(id);
    if (!invoice) throw new InvoiceNotFoundException(id);
    return InvoiceApplicationMapper.toResponse(invoice);
  }
}

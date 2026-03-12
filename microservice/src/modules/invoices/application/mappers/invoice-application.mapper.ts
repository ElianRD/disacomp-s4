import { Invoice } from '../../domain/entities/invoice.entity';
import { InvoiceResponseDto } from '../dtos/invoice-response.dto';

export class InvoiceApplicationMapper {
  static toResponse(invoice: Invoice): InvoiceResponseDto {
    return {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      clientId: invoice.clientId,
      date: invoice.date,
      total: invoice.total,
      status: invoice.status,
    };
  }
}

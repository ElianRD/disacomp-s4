import { Invoice } from '../../domain/entities/invoice.entity';
import { InvoiceItem } from '../../domain/entities/invoice-item.entity';
import { InvoiceResponseDto, InvoiceItemResponseDto } from '../dtos/invoice-response.dto';

export class InvoiceApplicationMapper {
  static toResponse(invoice: Invoice): InvoiceResponseDto {
    return {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      clientId: invoice.clientId,
      date: invoice.date,
      total: invoice.total,
      status: invoice.status,
      items: (invoice.items || []).map(item => InvoiceApplicationMapper.itemToResponse(item)),
    };
  }

  static itemToResponse(item: InvoiceItem): InvoiceItemResponseDto {
    return {
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subTotal: item.subTotal,
    };
  }
}

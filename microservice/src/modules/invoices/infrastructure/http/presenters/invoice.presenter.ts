import { InvoiceResponseDto } from '../../../application/dtos/invoice-response.dto';

export class InvoicePresenter {
  static present(dto: InvoiceResponseDto) {
    return {
      id: dto.id,
      invoiceNumber: dto.invoiceNumber,
      clientId: dto.clientId,
      date: dto.date,
      total: dto.total,
      status: dto.status,
    };
  }

  static presentMany(dtos: InvoiceResponseDto[]) {
    return dtos.map(InvoicePresenter.present);
  }
}

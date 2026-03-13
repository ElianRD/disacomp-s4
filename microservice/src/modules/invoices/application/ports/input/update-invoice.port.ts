import { UpdateInvoiceDto } from '../../dtos/update-invoice.dto';
import { InvoiceResponseDto } from '../../dtos/invoice-response.dto';

export interface IUpdateInvoicePort {
  execute(id: string, dto: UpdateInvoiceDto): Promise<InvoiceResponseDto>;
}

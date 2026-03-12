import { CreateInvoiceDto } from '../../dtos/create-invoice.dto';
import { InvoiceResponseDto } from '../../dtos/invoice-response.dto';

export interface ICreateInvoicePort {
  execute(dto: CreateInvoiceDto): Promise<InvoiceResponseDto>;
}

import { InvoiceResponseDto } from '../../dtos/invoice-response.dto';

export interface IGetInvoicePort {
  execute(id: string): Promise<InvoiceResponseDto | null>;
}

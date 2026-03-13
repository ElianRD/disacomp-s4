export class CreateInvoiceDto {
  invoiceNumber: string;
  clientId: string;
  date: Date;
  total: number;
  status: string;
}

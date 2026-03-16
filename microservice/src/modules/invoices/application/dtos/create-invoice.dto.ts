export class CreateInvoiceItemDto {
  productId: string;
  quantity: number;
}

export class CreateInvoiceDto {
  invoiceNumber: string;
  clientId: string;
  date?: Date;
  items: CreateInvoiceItemDto[];
  status?: string;
}

export class InvoiceItemResponseDto {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}

export class InvoiceResponseDto {
  id: string;
  invoiceNumber: string;
  clientId: string;
  date: Date;
  total: number;
  status: string;
  items: InvoiceItemResponseDto[];
}

export class SalesReportResponseDto {
  startDate: Date;
  endDate: Date;
  totalInvoices: number;
  totalSales: number;
  invoices: InvoiceResponseDto[];
}

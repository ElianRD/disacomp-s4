export class InvoiceResponseDto {
  id: string;
  invoiceNumber: string;
  clientId: string;
  date: Date;
  total: number;
  status: string;
}

export class SalesReportResponseDto {
  startDate: Date;
  endDate: Date;
  totalInvoices: number;
  totalSales: number;
  invoices: InvoiceResponseDto[];
}

import { Invoice } from '../entities/invoice.entity';

export interface IInvoiceRepository {
  save(invoice: Invoice): Promise<Invoice>;
  findAll(clientId?: string): Promise<Invoice[]>;
  findById(id: string): Promise<Invoice | null>;
  delete(id: string): Promise<void>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Invoice[]>;
  findByInvoiceNumber(invoiceNumber: string): Promise<Invoice | null>;
}

export const INVOICE_REPOSITORY = 'INVOICE_REPOSITORY';

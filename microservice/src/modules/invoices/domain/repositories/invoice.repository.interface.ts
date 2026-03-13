import { Invoice } from '../entities/invoice.entity';

export interface IInvoiceRepository {
  create(invoice: Partial<Invoice>): Promise<Invoice>;
  findAll(): Promise<Invoice[]>;
  findById(id: string): Promise<Invoice | null>;
  update(id: string, data: Partial<Invoice>): Promise<Invoice>;
  delete(id: string): Promise<void>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Invoice[]>;
  findByInvoiceNumber(invoiceNumber: string): Promise<Invoice | null>;
}

export const INVOICE_REPOSITORY = 'INVOICE_REPOSITORY';

import { Invoice } from './invoice.entity';

export interface InvoiceRepository {
  create(invoice: Partial<Invoice>): Promise<Invoice>;
  findAll(): Promise<Invoice[]>;
  findById(id: number): Promise<Invoice | null>;
  update(id: number, data: Partial<Invoice>): Promise<Invoice>;
  delete(id: number): Promise<void>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Invoice[]>;
}

export const INVOICE_REPOSITORY = 'INVOICE_REPOSITORY';

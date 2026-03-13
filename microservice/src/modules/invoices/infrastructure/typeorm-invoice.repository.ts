import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { InvoiceRepository } from '../domain/invoice.repository';
import { Invoice } from '../domain/invoice.entity';
import { InvoiceOrmEntity } from './invoice.orm-entity';

@Injectable()
export class TypeOrmInvoiceRepository implements InvoiceRepository {
  constructor(
    @InjectRepository(InvoiceOrmEntity)
    private readonly repository: Repository<InvoiceOrmEntity>,
  ) {}

  async create(invoiceData: Partial<Invoice>): Promise<Invoice> {
    const newInvoice = this.repository.create(invoiceData);
    const savedInvoice = await this.repository.save(newInvoice);
    return savedInvoice.toDomain();
  }

  async findAll(): Promise<Invoice[]> {
    const invoices = await this.repository.find();
    return invoices.map((inv) => inv.toDomain());
  }

  async findById(id: number): Promise<Invoice | null> {
    const invoice = await this.repository.findOne({ where: { id } });
    if (!invoice) return null;
    return invoice.toDomain();
  }

  async update(id: number, data: Partial<Invoice>): Promise<Invoice> {
    await this.repository.update(id, data);
    const updatedInvoice = await this.findById(id);
    return updatedInvoice as Invoice;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Invoice[]> {
    const invoices = await this.repository.find({
      where: {
        date: Between(startDate, endDate),
      },
    });
    return invoices.map((inv) => inv.toDomain());
  }
}

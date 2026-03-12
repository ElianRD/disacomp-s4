import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { IInvoiceRepository } from '../../../domain/repositories/invoice.repository.interface';
import { Invoice } from '../../../domain/entities/invoice.entity';
import { InvoiceOrmEntity } from '../entities/invoice.orm-entity';
import { InvoicePersistenceMapper } from '../mappers/invoice-persistence.mapper';

@Injectable()
export class InvoiceRepository implements IInvoiceRepository {
  constructor(
    @InjectRepository(InvoiceOrmEntity)
    private readonly repository: Repository<InvoiceOrmEntity>,
  ) {}

  async create(data: Partial<Invoice>): Promise<Invoice> {
    const ormData = InvoicePersistenceMapper.toOrm(data);
    const created = this.repository.create(ormData);
    const saved = await this.repository.save(created);
    return InvoicePersistenceMapper.toDomain(saved);
  }

  async findAll(): Promise<Invoice[]> {
    const entities = await this.repository.find();
    return entities.map(InvoicePersistenceMapper.toDomain);
  }

  async findById(id: string): Promise<Invoice | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) return null;
    return InvoicePersistenceMapper.toDomain(entity);
  }

  async update(id: string, data: Partial<Invoice>): Promise<Invoice> {
    await this.repository.update(id, InvoicePersistenceMapper.toOrm(data));
    const updated = await this.repository.findOne({ where: { id } });
    return InvoicePersistenceMapper.toDomain(updated!);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Invoice[]> {
    const entities = await this.repository.find({
      where: { date: Between(startDate, endDate) },
    });
    return entities.map(InvoicePersistenceMapper.toDomain);
  }

  async findByInvoiceNumber(invoiceNumber: string): Promise<Invoice | null> {
    const entity = await this.repository.findOne({ where: { invoiceNumber } });
    if (!entity) return null;
    return InvoicePersistenceMapper.toDomain(entity);
  }
}

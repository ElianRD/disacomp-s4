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

  async save(invoice: Invoice): Promise<Invoice> {
    const ormData = InvoicePersistenceMapper.toOrm(invoice);
    const saved = await this.repository.save(ormData);
    return InvoicePersistenceMapper.toDomain(saved);
  }

  async findAll(clientId?: string): Promise<Invoice[]> {
    const whereCondition = clientId ? { clientId } : {};
    const entities = await this.repository.find({ 
      where: whereCondition,
      relations: ['items'] 
    });
    return entities.map(InvoicePersistenceMapper.toDomain);
  }

  async findById(id: string): Promise<Invoice | null> {
    const entity = await this.repository.findOne({ where: { id }, relations: ['items'] });
    if (!entity) return null;
    return InvoicePersistenceMapper.toDomain(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Invoice[]> {
    const entities = await this.repository.find({
      where: { date: Between(startDate, endDate) },
      relations: ['items']
    });
    return entities.map(InvoicePersistenceMapper.toDomain);
  }

  async findByInvoiceNumber(invoiceNumber: string): Promise<Invoice | null> {
    const entity = await this.repository.findOne({ where: { invoiceNumber }, relations: ['items'] });
    if (!entity) return null;
    return InvoicePersistenceMapper.toDomain(entity);
  }
}

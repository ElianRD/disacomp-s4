import { Invoice } from '../../../domain/entities/invoice.entity';
import { InvoiceOrmEntity } from '../entities/invoice.orm-entity';

export class InvoicePersistenceMapper {
  static toDomain(orm: InvoiceOrmEntity): Invoice {
    return Invoice.create({
      id: orm.id,
      invoiceNumber: orm.invoiceNumber,
      clientId: orm.clientId,
      date: new Date(orm.date),
      total: Number(orm.total),
      status: orm.status,
    });
  }

  static toOrm(invoice: Partial<Invoice>): Partial<InvoiceOrmEntity> {
    return {
      invoiceNumber: invoice.invoiceNumber,
      clientId: invoice.clientId,
      date: invoice.date,
      total: invoice.total,
      status: invoice.status,
    };
  }
}

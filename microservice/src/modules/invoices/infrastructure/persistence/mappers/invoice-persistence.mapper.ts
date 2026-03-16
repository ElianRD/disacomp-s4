import { Invoice } from '../../../domain/entities/invoice.entity';
import { InvoiceItem } from '../../../domain/entities/invoice-item.entity';
import { InvoiceOrmEntity } from '../entities/invoice.orm-entity';
import { InvoiceItemOrmEntity } from '../entities/invoice-item.orm-entity';
import { v4 as uuidv4 } from 'uuid';

export class InvoicePersistenceMapper {
  static toDomain(orm: InvoiceOrmEntity): Invoice {
    const items = orm.items ? orm.items.map(InvoicePersistenceMapper.itemToDomain) : [];
    return Invoice.create({
      id: orm.id,
      invoiceNumber: orm.invoiceNumber,
      clientId: orm.clientId,
      date: new Date(orm.date),
      total: Number(orm.total),
      status: orm.status,
      items: items,
    });
  }

  static toOrm(invoice: Invoice): InvoiceOrmEntity {
    const ormEntity = new InvoiceOrmEntity();
    ormEntity.id = invoice.id;
    ormEntity.invoiceNumber = invoice.invoiceNumber;
    ormEntity.clientId = invoice.clientId;
    ormEntity.date = invoice.date;
    ormEntity.total = invoice.total;
    ormEntity.status = invoice.status;
    
    if (invoice.items) {
      ormEntity.items = invoice.items.map(item => {
        const itemOrm = new InvoiceItemOrmEntity();
        itemOrm.id = item.id;
        itemOrm.invoiceId = item.invoiceId;
        itemOrm.productId = item.productId;
        itemOrm.quantity = item.quantity;
        itemOrm.unitPrice = item.unitPrice;
        itemOrm.subTotal = item.subTotal;
        return itemOrm;
      });
    }
    return ormEntity;
  }

  private static itemToDomain(itemOrm: InvoiceItemOrmEntity): InvoiceItem {
    return InvoiceItem.create({
      id: itemOrm.id,
      invoiceId: itemOrm.invoiceId,
      productId: itemOrm.productId,
      quantity: itemOrm.quantity,
      unitPrice: Number(itemOrm.unitPrice),
      subTotal: Number(itemOrm.subTotal),
    });
  }
}

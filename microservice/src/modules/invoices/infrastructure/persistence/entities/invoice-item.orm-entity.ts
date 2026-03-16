import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { InvoiceOrmEntity } from './invoice.orm-entity';
import { ProductOrmEntity } from '../../../../products/infrastructure/persistence/entities/product.orm-entity';

@Entity('invoice_items')
export class InvoiceItemOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  invoiceId: string;

  @Column('uuid')
  productId: string;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subTotal: number;

  @ManyToOne(() => InvoiceOrmEntity, (invoice) => invoice.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invoiceId' })
  invoice: InvoiceOrmEntity;

  // Assuming ProductOrmEntity exists and provides name, etc. We just need the relation for constraints.
  @ManyToOne(() => ProductOrmEntity)
  @JoinColumn({ name: 'productId' })
  product: ProductOrmEntity;
}

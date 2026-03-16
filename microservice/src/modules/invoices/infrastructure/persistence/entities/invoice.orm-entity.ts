import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { InvoiceItemOrmEntity } from './invoice-item.orm-entity';

@Entity('invoices')
export class InvoiceOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  invoiceNumber: string;

  @Column()
  clientId: string;

  @Column({ type: 'datetime' })
  date: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({ default: 'PAID' })
  status: string;

  @OneToMany(() => InvoiceItemOrmEntity, (item) => item.invoice, { cascade: true, eager: true })
  items: InvoiceItemOrmEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

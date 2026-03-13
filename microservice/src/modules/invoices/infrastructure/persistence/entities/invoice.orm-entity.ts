import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

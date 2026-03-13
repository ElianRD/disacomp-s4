import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Invoice } from '../domain/invoice.entity';

@Entity('invoices')
export class InvoiceOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  invoiceNumber: string;

  @Column()
  clientId: number;

  @Column()
  date: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({ default: 'PAID' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  toDomain(): Invoice {
    return new Invoice(
      this.id,
      this.invoiceNumber,
      this.clientId,
      this.date,
      Number(this.total),
      this.status,
    );
  }
}

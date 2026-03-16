import { InvoiceNumber } from '../value-objects/invoice-number.vo';
import { Money } from '../value-objects/money.vo';
import { InvoiceCreatedEvent } from '../events/invoice-created.event';
import { InvoiceUpdatedEvent } from '../events/invoice-updated.event';
import { InvoiceDeletedEvent } from '../events/invoice-deleted.event';
import { InvoiceItem } from './invoice-item.entity';

export type InvoiceStatus = 'PAID' | 'PENDING' | 'CANCELLED';

export class Invoice {
  private _domainEvents: Array<InvoiceCreatedEvent | InvoiceUpdatedEvent | InvoiceDeletedEvent> = [];
  private _items: InvoiceItem[] = [];

  constructor(
    public readonly id: string,
    private _invoiceNumber: InvoiceNumber,
    public readonly clientId: string,
    private _date: Date,
    private _total: Money,
    private _status: InvoiceStatus,
    items?: InvoiceItem[]
  ) {
    if (items) {
      this._items = items;
    }
  }

  static create(props: {
    id: string;
    invoiceNumber: string;
    clientId: string;
    date: Date;
    total?: number;
    status: string;
    items?: InvoiceItem[];
  }): Invoice {
    const totalAmount = props.total !== undefined ? props.total : 0;
    const invoice = new Invoice(
      props.id,
      new InvoiceNumber(props.invoiceNumber),
      props.clientId,
      props.date,
      new Money(totalAmount),
      props.status as InvoiceStatus,
      props.items || []
    );
    
    if (props.items && props.items.length > 0 && props.total === undefined) {
      invoice.recalculateTotals();
    }

    invoice._domainEvents.push(
      new InvoiceCreatedEvent(
        props.id,
        props.invoiceNumber,
        props.clientId,
        invoice.total,
        props.status,
        props.date,
      ),
    );
    return invoice;
  }

  get invoiceNumber(): string { return this._invoiceNumber.getValue(); }
  get date(): Date { return this._date; }
  get total(): number { return this._total.getAmount(); }
  get status(): InvoiceStatus { return this._status; }
  get items(): InvoiceItem[] { return [...this._items]; }
  get domainEvents() { return [...this._domainEvents]; }

  update(changes: { invoiceNumber?: string; total?: number; status?: string; date?: Date }): void {
    if (changes.invoiceNumber) this._invoiceNumber = new InvoiceNumber(changes.invoiceNumber);
    if (changes.total !== undefined) this._total = new Money(changes.total);
    if (changes.status) this._status = changes.status as InvoiceStatus;
    if (changes.date) this._date = changes.date;
    this._domainEvents.push(new InvoiceUpdatedEvent(this.id, changes));
  }

  addItem(item: InvoiceItem): void {
    this._items.push(item);
    this.recalculateTotals();
  }

  recalculateTotals(): void {
    const subTotal = this._items.reduce((sum, item) => sum + item.subTotal, 0);
    const tax = subTotal * 0.18; // 18% ITBIS
    const finalTotal = subTotal + tax;
    this._total = new Money(finalTotal);
  }

  markAsDeleted(): void {
    this._domainEvents.push(new InvoiceDeletedEvent(this.id));
  }

  clearEvents(): void { this._domainEvents = []; }
}

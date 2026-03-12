import { InvoiceNumber } from '../value-objects/invoice-number.vo';
import { Money } from '../value-objects/money.vo';
import { InvoiceCreatedEvent } from '../events/invoice-created.event';
import { InvoiceUpdatedEvent } from '../events/invoice-updated.event';
import { InvoiceDeletedEvent } from '../events/invoice-deleted.event';

export type InvoiceStatus = 'PAID' | 'PENDING' | 'CANCELLED';

export class Invoice {
  private _domainEvents: Array<InvoiceCreatedEvent | InvoiceUpdatedEvent | InvoiceDeletedEvent> = [];

  constructor(
    public readonly id: string,
    private _invoiceNumber: InvoiceNumber,
    public readonly clientId: string,
    private _date: Date,
    private _total: Money,
    private _status: InvoiceStatus,
  ) {}

  static create(props: {
    id: string;
    invoiceNumber: string;
    clientId: string;
    date: Date;
    total: number;
    status: string;
  }): Invoice {
    const invoice = new Invoice(
      props.id,
      new InvoiceNumber(props.invoiceNumber),
      props.clientId,
      props.date,
      new Money(props.total),
      props.status as InvoiceStatus,
    );
    invoice._domainEvents.push(
      new InvoiceCreatedEvent(
        props.id,
        props.invoiceNumber,
        props.clientId,
        props.total,
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
  get domainEvents() { return [...this._domainEvents]; }

  update(changes: { invoiceNumber?: string; total?: number; status?: string; date?: Date }): void {
    if (changes.invoiceNumber) this._invoiceNumber = new InvoiceNumber(changes.invoiceNumber);
    if (changes.total !== undefined) this._total = new Money(changes.total);
    if (changes.status) this._status = changes.status as InvoiceStatus;
    if (changes.date) this._date = changes.date;
    this._domainEvents.push(new InvoiceUpdatedEvent(this.id, changes));
  }

  markAsDeleted(): void {
    this._domainEvents.push(new InvoiceDeletedEvent(this.id));
  }

  clearEvents(): void { this._domainEvents = []; }
}

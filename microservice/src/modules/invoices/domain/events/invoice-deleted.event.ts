export class InvoiceDeletedEvent {
  public readonly eventName = 'invoice.deleted';
  public readonly occurredAt: Date;

  constructor(public readonly invoiceId: string) {
    this.occurredAt = new Date();
  }
}

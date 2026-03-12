export class InvoiceCreatedEvent {
  public readonly eventName = 'invoice.created';
  public readonly occurredAt: Date;

  constructor(
    public readonly invoiceId: string,
    public readonly invoiceNumber: string,
    public readonly clientId: string,
    public readonly total: number,
    public readonly status: string,
    public readonly date: Date,
  ) {
    this.occurredAt = new Date();
  }
}

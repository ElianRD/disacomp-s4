export class InvoiceUpdatedEvent {
  public readonly eventName = 'invoice.updated';
  public readonly occurredAt: Date;

  constructor(
    public readonly invoiceId: string,
    public readonly changes: Partial<{
      invoiceNumber: string;
      clientId: number;
      total: number;
      status: string;
      date: Date;
    }>,
  ) {
    this.occurredAt = new Date();
  }
}

export class Invoice {
  constructor(
    public readonly id: number,
    public invoiceNumber: string,
    public clientId: number,
    public date: Date,
    public total: number,
    public status: string,
  ) {}
}

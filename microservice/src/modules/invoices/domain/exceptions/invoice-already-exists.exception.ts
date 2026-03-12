export class InvoiceAlreadyExistsException extends Error {
  constructor(invoiceNumber: string) {
    super(`Ya existe una factura con el número '${invoiceNumber}'`);
    this.name = 'InvoiceAlreadyExistsException';
  }
}

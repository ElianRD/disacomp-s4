export class InvoiceNotFoundException extends Error {
  constructor(id: string | number) {
    super(`Factura con id '${id}' no encontrada`);
    this.name = 'InvoiceNotFoundException';
  }
}

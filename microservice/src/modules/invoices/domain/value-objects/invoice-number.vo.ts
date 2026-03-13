export class InvoiceNumber {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('El número de factura no puede estar vacío');
    }
    this.value = value.trim().toUpperCase();
  }

  getValue(): string {
    return this.value;
  }

  equals(other: InvoiceNumber): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

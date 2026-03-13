export class InvoiceId {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('InvoiceId no puede estar vacío');
    }
    this.value = value.trim();
  }

  getValue(): string {
    return this.value;
  }

  equals(other: InvoiceId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

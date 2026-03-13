export class Phone {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('El teléfono no puede estar vacío');
    }
    // Acepta formatos: 809-555-1234, 8095551234, +18095551234
    if (!/^(\+1)?[\-\s]?\d{3}[\-\s]?\d{3}[\-\s]?\d{4}$/.test(value.trim())) {
      throw new Error('Teléfono inválido: formato esperado 809-555-1234');
    }
    this.value = value.trim();
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Phone): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

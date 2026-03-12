export class Rnc {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('El RNC no puede estar vacío');
    }
    if (!/^\d{9}(\d{2})?$/.test(value.trim())) {
      throw new Error('RNC inválido: debe tener 9 u 11 dígitos');
    }
    this.value = value.trim();
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Rnc): boolean {
    return this.value === other.value;
  }
}

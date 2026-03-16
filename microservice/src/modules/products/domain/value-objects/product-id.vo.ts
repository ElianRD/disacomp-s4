export class ProductId {
  private readonly value: string;

  constructor(value: string) {
    if (!this.isValidUuid(value)) {
      throw new Error('Formato de UUID inválido para ProductId');
    }
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  private isValidUuid(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}

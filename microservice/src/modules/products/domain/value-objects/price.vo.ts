export class Price {
  private readonly amount: number;

  constructor(amount: number) {
    if (amount < 0) {
      throw new Error('El precio no puede ser negativo');
    }
    // Redondear a 2 decimales para dinero
    this.amount = Math.round(amount * 100) / 100;
  }

  getValue(): number {
    return this.amount;
  }
}

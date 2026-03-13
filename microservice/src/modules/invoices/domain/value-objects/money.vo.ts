export class Money {
  private readonly amount: number;

  constructor(amount: number) {
    if (amount < 0) {
      throw new Error('El monto no puede ser negativo');
    }
    this.amount = Math.round(amount * 100) / 100;
  }

  getAmount(): number {
    return this.amount;
  }

  equals(other: Money): boolean {
    return this.amount === other.amount;
  }

  toString(): string {
    return `$${this.amount.toFixed(2)}`;
  }
}

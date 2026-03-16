export interface InvoiceItemProperties {
  id: string;
  invoiceId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}

export class InvoiceItem {
  private _id: string;
  private _invoiceId: string;
  private _productId: string;
  private _quantity: number;
  private _unitPrice: number;
  private _subTotal: number;

  private constructor(properties: InvoiceItemProperties) {
    this._id = properties.id;
    this._invoiceId = properties.invoiceId;
    this._productId = properties.productId;
    this.quantity = properties.quantity;
    this.unitPrice = properties.unitPrice;
    this._subTotal = properties.subTotal;
  }

  static create(properties: InvoiceItemProperties): InvoiceItem {
    return new InvoiceItem(properties);
  }

  // Getters
  get id(): string { return this._id; }
  get invoiceId(): string { return this._invoiceId; }
  get productId(): string { return this._productId; }
  get quantity(): number { return this._quantity; }
  get unitPrice(): number { return this._unitPrice; }
  get subTotal(): number { return this._subTotal; }

  // Setters
  set quantity(value: number) {
    if (value <= 0) throw new Error('La cantidad debe ser mayor a 0');
    this._quantity = value;
    this.recalculateSubTotal();
  }

  set unitPrice(value: number) {
    if (value < 0) throw new Error('El precio unitario no puede ser negativo');
    this._unitPrice = value;
    this.recalculateSubTotal();
  }

  private recalculateSubTotal(): void {
    if (this._quantity && this._unitPrice) {
      this._subTotal = this._quantity * this._unitPrice;
    }
  }
}

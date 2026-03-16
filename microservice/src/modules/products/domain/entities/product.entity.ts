import { ProductId } from '../value-objects/product-id.vo';
import { Price } from '../value-objects/price.vo';

export interface ProductProperties {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Product {
  private _id: ProductId;
  private _name: string;
  private _description: string;
  private _price: Price;
  private _stock: number;
  private _sku: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(properties: ProductProperties) {
    this._id = new ProductId(properties.id);
    this.name = properties.name; // Usa los setters para validación
    this.description = properties.description;
    this._price = new Price(properties.price);
    this.stock = properties.stock;
    this.sku = properties.sku;
    this._createdAt = properties.createdAt || new Date();
    this._updatedAt = properties.updatedAt || new Date();
  }

  static create(properties: ProductProperties): Product {
    return new Product(properties);
  }

  // Getters
  get id(): ProductId { return this._id; }
  get name(): string { return this._name; }
  get description(): string { return this._description; }
  get price(): Price { return this._price; }
  get stock(): number { return this._stock; }
  get sku(): string { return this._sku; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  // Setters de dominio (con validaciones)
  set name(value: string) {
    if (!value || value.trim().length === 0) throw new Error('El nombre es requerido');
    this._name = value.trim();
  }

  set description(value: string) {
    this._description = value ? value.trim() : '';
  }

  set sku(value: string) {
    if (!value || value.trim().length === 0) throw new Error('El SKU es requerido');
    this._sku = value.trim();
  }

  set stock(value: number) {
    if (value < 0) throw new Error('El stock no puede ser negativo');
    this._stock = value;
  }

  updatePrice(newAmount: number): void {
    this._price = new Price(newAmount);
    this.updateTimestamp();
  }

  reduceStock(amount: number): void {
    if (this._stock < amount) throw new Error('Stock insuficiente');
    this._stock -= amount;
    this.updateTimestamp();
  }

  addStock(amount: number): void {
    if (amount <= 0) throw new Error('La cantidad a agregar debe ser mayor a 0');
    this._stock += amount;
    this.updateTimestamp();
  }

  public updateTimestamp(): void {
    this._updatedAt = new Date();
  }
}

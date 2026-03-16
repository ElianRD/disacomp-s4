export class ProductNotFoundException extends Error {
  constructor(identifier: string) {
    super(`Producto con identificador ${identifier} no encontrado`);
    this.name = 'ProductNotFoundException';
  }
}

export class ProductAlreadyExistsException extends Error {
  constructor(sku: string) {
    super(`Ya existe un producto con el SKU: ${sku}`);
    this.name = 'ProductAlreadyExistsException';
  }
}

import { Product } from '../entities/product.entity';
import { ProductId } from '../value-objects/product-id.vo';

export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY';

export interface IProductRepository {
  save(product: Product): Promise<void>;
  findAll(): Promise<Product[]>;
  findById(id: ProductId): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  update(product: Product): Promise<void>;
  delete(id: ProductId): Promise<void>;
}

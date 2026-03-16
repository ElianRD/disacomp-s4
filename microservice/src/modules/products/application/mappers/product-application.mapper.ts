import { Product } from '../../domain/entities/product.entity';
import { ProductResponseDto } from '../dtos/product-response.dto';

export class ProductApplicationMapper {
  static toResponse(product: Product): ProductResponseDto {
    return {
      id: product.id.getValue(),
      name: product.name,
      description: product.description,
      price: product.price.getValue(),
      stock: product.stock,
      sku: product.sku,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }
}

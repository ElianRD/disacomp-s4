import { Product } from '../../../domain/entities/product.entity';
import { ProductOrmEntity } from '../entities/product.orm-entity';

export class ProductPersistenceMapper {
  static toDomain(entity: ProductOrmEntity): Product {
    return Product.create({
      id: entity.id,
      name: entity.name,
      description: entity.description || '',
      price: Number(entity.price),
      stock: entity.stock,
      sku: entity.sku,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toOrm(product: Product): ProductOrmEntity {
    const ormEntity = new ProductOrmEntity();
    ormEntity.id = product.id.getValue();
    ormEntity.name = product.name;
    ormEntity.description = product.description;
    ormEntity.price = product.price.getValue();
    ormEntity.stock = product.stock;
    ormEntity.sku = product.sku;
    ormEntity.createdAt = product.createdAt;
    ormEntity.updatedAt = product.updatedAt;
    return ormEntity;
  }
}

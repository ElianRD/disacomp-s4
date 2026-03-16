import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IProductRepository } from '../../../domain/repositories/product.repository.interface';
import { Product } from '../../../domain/entities/product.entity';
import { ProductId } from '../../../domain/value-objects/product-id.vo';
import { ProductOrmEntity } from '../entities/product.orm-entity';
import { ProductPersistenceMapper } from '../mappers/product-persistence.mapper';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repo: Repository<ProductOrmEntity>,
  ) {}

  async save(product: Product): Promise<void> {
    await this.repo.save(ProductPersistenceMapper.toOrm(product));
  }

  async findAll(): Promise<Product[]> {
    const entities = await this.repo.find();
    return entities.map(ProductPersistenceMapper.toDomain);
  }

  async findById(id: ProductId): Promise<Product | null> {
    const entity = await this.repo.findOneBy({ id: id.getValue() });
    if (!entity) return null;
    return ProductPersistenceMapper.toDomain(entity);
  }

  async findBySku(sku: string): Promise<Product | null> {
    const entity = await this.repo.findOneBy({ sku });
    if (!entity) return null;
    return ProductPersistenceMapper.toDomain(entity);
  }

  async update(product: Product): Promise<void> {
    await this.repo.update(
      product.id.getValue(),
      ProductPersistenceMapper.toOrm(product),
    );
  }

  async delete(id: ProductId): Promise<void> {
    await this.repo.delete(id.getValue());
  }
}

import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateProductDto } from '../dtos/create-product.dto';
import { ProductResponseDto } from '../dtos/product-response.dto';
import type { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository.interface';
import { Product } from '../../domain/entities/product.entity';
import { ProductAlreadyExistsException } from '../../domain/exceptions/product.exceptions';
import { ProductApplicationMapper } from '../mappers/product-application.mapper';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repo: IProductRepository,
  ) {}

  async execute(dto: CreateProductDto): Promise<ProductResponseDto> {
    const existing = await this.repo.findBySku(dto.sku);
    if (existing) {
      throw new ProductAlreadyExistsException(dto.sku);
    }

    const product = Product.create({
      id: uuidv4(),
      name: dto.name,
      description: dto.description || '',
      price: dto.price,
      stock: dto.stock,
      sku: dto.sku,
    });

    await this.repo.save(product);
    return ProductApplicationMapper.toResponse(product);
  }
}

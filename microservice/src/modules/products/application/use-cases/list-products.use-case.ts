import { Injectable, Inject } from '@nestjs/common';
import { ProductResponseDto } from '../dtos/product-response.dto';
import type { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository.interface';
import { ProductApplicationMapper } from '../mappers/product-application.mapper';

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repo: IProductRepository,
  ) {}

  async execute(): Promise<ProductResponseDto[]> {
    const products = await this.repo.findAll();
    return products.map(ProductApplicationMapper.toResponse);
  }
}

import { Injectable, Inject } from '@nestjs/common';
import { ProductResponseDto } from '../dtos/product-response.dto';
import type { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository.interface';
import { ProductId } from '../../domain/value-objects/product-id.vo';
import { ProductNotFoundException } from '../../domain/exceptions/product.exceptions';
import { ProductApplicationMapper } from '../mappers/product-application.mapper';

@Injectable()
export class GetProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repo: IProductRepository,
  ) {}

  async execute(id: string): Promise<ProductResponseDto> {
    const product = await this.repo.findById(new ProductId(id));
    if (!product) {
      throw new ProductNotFoundException(id);
    }
    return ProductApplicationMapper.toResponse(product);
  }
}

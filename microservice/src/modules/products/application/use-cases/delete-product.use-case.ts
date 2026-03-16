import { Injectable, Inject } from '@nestjs/common';
import type { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository.interface';
import { ProductId } from '../../domain/value-objects/product-id.vo';
import { ProductNotFoundException } from '../../domain/exceptions/product.exceptions';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repo: IProductRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const productId = new ProductId(id);
    const existing = await this.repo.findById(productId);
    if (!existing) {
      throw new ProductNotFoundException(id);
    }
    
    await this.repo.delete(productId);
  }
}

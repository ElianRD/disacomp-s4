import { Injectable, Inject } from '@nestjs/common';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { ProductResponseDto } from '../dtos/product-response.dto';
import type { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository.interface';
import { ProductId } from '../../domain/value-objects/product-id.vo';
import { ProductNotFoundException } from '../../domain/exceptions/product.exceptions';
import { ProductApplicationMapper } from '../mappers/product-application.mapper';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repo: IProductRepository,
  ) {}

  async execute(dto: UpdateProductDto): Promise<ProductResponseDto> {
    const product = await this.repo.findById(new ProductId(dto.id));
    if (!product) {
      throw new ProductNotFoundException(dto.id);
    }

    if (dto.name !== undefined) product.name = dto.name;
    if (dto.description !== undefined) product.description = dto.description;
    if (dto.price !== undefined) product.updatePrice(dto.price);
    if (dto.stock !== undefined) {
      product.stock = dto.stock; // Uso directo del setter que valida > 0
      product.updateTimestamp();
    }

    await this.repo.update(product);
    return ProductApplicationMapper.toResponse(product);
  }
}

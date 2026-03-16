import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateProductUseCase } from '../../../application/use-cases/create-product.use-case';
import { GetProductUseCase } from '../../../application/use-cases/get-product.use-case';
import { ListProductsUseCase } from '../../../application/use-cases/list-products.use-case';
import { UpdateProductUseCase } from '../../../application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from '../../../application/use-cases/delete-product.use-case';

@Controller()
export class ProductEventConsumer {
  constructor(
    private readonly createProduct: CreateProductUseCase,
    private readonly getProduct: GetProductUseCase,
    private readonly listProducts: ListProductsUseCase,
    private readonly updateProduct: UpdateProductUseCase,
    private readonly deleteProduct: DeleteProductUseCase,
  ) {}

  @MessagePattern('create_product')
  async onCreate(@Payload() data: any) {
    try {
      const result = await this.createProduct.execute(data);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @MessagePattern('find_all_products')
  async onFindAll() {
    try {
      const result = await this.listProducts.execute();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @MessagePattern('find_product')
  async onFindOne(@Payload() data: { id: string }) {
    try {
      const result = await this.getProduct.execute(data.id);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @MessagePattern('update_product')
  async onUpdate(@Payload() data: any) {
    try {
      const result = await this.updateProduct.execute(data);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @MessagePattern('delete_product')
  async onDelete(@Payload() data: { id: string }) {
    try {
      await this.deleteProduct.execute(data.id);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

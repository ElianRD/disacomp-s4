import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrmEntity } from './infrastructure/persistence/entities/product.orm-entity';
import { ProductRepository } from './infrastructure/persistence/repositories/product.repository';
import { PRODUCT_REPOSITORY } from './domain/repositories/product.repository.interface';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { GetProductUseCase } from './application/use-cases/get-product.use-case';
import { ListProductsUseCase } from './application/use-cases/list-products.use-case';
import { UpdateProductUseCase } from './application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from './application/use-cases/delete-product.use-case';
import { ProductEventConsumer } from './infrastructure/messaging/consumers/product-event.consumer';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOrmEntity])],
  controllers: [ProductEventConsumer],
  providers: [
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepository,
    },
    CreateProductUseCase,
    GetProductUseCase,
    ListProductsUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
  ],
  exports: [PRODUCT_REPOSITORY], // Exportado por si otro modulo quiere consultar productos desde adentro
})
export class ProductsModule {}

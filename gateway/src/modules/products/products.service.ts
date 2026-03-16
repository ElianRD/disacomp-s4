import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('MAIN_SERVICE') private readonly client: ClientProxy,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      return await firstValueFrom(this.client.send('create_product', createProductDto));
    } catch (error) {
      throw new HttpException('RabbitMQ no disponible', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async findAll() {
    return firstValueFrom(this.client.send('find_all_products', {}));
  }

  async findOne(id: string) {
    return firstValueFrom(this.client.send('find_product', { id }));
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return firstValueFrom(this.client.send('update_product', { id, ...updateProductDto }));
  }

  async remove(id: string) {
    return firstValueFrom(this.client.send('delete_product', { id }));
  }
}

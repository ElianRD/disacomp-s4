import { Module } from '@nestjs/common';
import { ClientsModule as NestClientsModule, Transport } from '@nestjs/microservices';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [
    NestClientsModule.register([
      {
        name: 'MAIN_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: process.env.RABBITMQ_QUEUE || 'main_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}

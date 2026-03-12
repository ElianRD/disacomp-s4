import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import type { MicroserviceOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';
import { environment } from './config/env.config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [environment.RABBITMQ_URL],
        queue: environment.RABBITMQ_QUEUE,
        queueOptions: { durable: false },
      },
    },
  );
  await app.listen();
  console.log('Microservicio escuchando en RabbitMQ (cola: main_queue)');
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import type { MicroserviceOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@localhost:5672'],
        queue: 'main_queue',
        queueOptions: { durable: false },
      },
    },
  );
  await app.listen();
  console.log('Microservicio escuchando en RabbitMQ (cola: main_queue)');
}
bootstrap();


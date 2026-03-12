import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        // process.env está disponible porque ConfigModule.forRoot() carga el .env
        // antes de que NestJS procese las opciones del transporte
        urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
        queue: process.env.RABBITMQ_QUEUE || 'main_queue',
        queueOptions: { durable: false },
      },
    },
  );
  await app.listen();
  console.log(`Microservicio escuchando en RabbitMQ (cola: ${process.env.RABBITMQ_QUEUE || 'main_queue'})...`);
}
bootstrap();

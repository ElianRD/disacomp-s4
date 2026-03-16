import { Module } from '@nestjs/common';
import { ClientsModule as NestClientsModule, Transport } from '@nestjs/microservices';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { environment } from '../../config/env.config';

@Module({
  imports: [
    NestClientsModule.register([
      {
        name: 'MAIN_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [environment.RABBITMQ_URL],
          queue: environment.RABBITMQ_QUEUE,
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}

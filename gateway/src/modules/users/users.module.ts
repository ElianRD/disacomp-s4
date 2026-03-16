import { Module } from '@nestjs/common';
import { ClientsModule as NestClientsModule, Transport } from '@nestjs/microservices';
import { environment } from '../../config/env.config';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

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
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

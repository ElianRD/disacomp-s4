import { Module } from '@nestjs/common';
import { ClientsModule as NestClientsModule, Transport } from '@nestjs/microservices';
import { environment } from '../../config/env.config';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';

import { PdfGeneratorService } from './pdf-generator.service';

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
  controllers: [InvoicesController],
  providers: [InvoicesService, PdfGeneratorService],
})
export class InvoicesModule {}

import { Module } from '@nestjs/common';
import { ClientsModule } from './modules/clients/clients.module';
import { InvoicesModule } from './modules/invoices/invoices.module';

@Module({
  imports: [ClientsModule, InvoicesModule],
})
export class AppModule {}

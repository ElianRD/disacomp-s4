import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InvoicesModule } from './modules/invoices/invoices.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    InvoicesModule,
  ],
})
export class AppModule {}

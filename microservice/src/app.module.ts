import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from './modules/clients/clients.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { ClientOrmEntity } from './modules/clients/infrastructure/client.orm-entity';
import { InvoiceOrmEntity } from './modules/invoices/infrastructure/persistence/entities/invoice.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'disacomp_db',
      entities: [ClientOrmEntity, InvoiceOrmEntity],
      synchronize: true,
    }),
    ClientsModule,
    InvoicesModule,
  ],
})
export class AppModule {}


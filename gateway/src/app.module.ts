import { Module } from '@nestjs/common';
import { ClientsModule } from './modules/clients/clients.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { SeedModule } from './modules/seed/seed.module';
import { ProductsModule } from './modules/products/products.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [ClientsModule, InvoicesModule, SeedModule, ProductsModule, AuthModule, UsersModule],
})
export class AppModule {}

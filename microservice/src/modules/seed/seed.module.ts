import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ClientOrmEntity } from '../clients/infrastructure/persistence/entities/client.orm-entity';
import { InvoiceOrmEntity } from '../invoices/infrastructure/persistence/entities/invoice.orm-entity';
import { ProductOrmEntity } from '../products/infrastructure/persistence/entities/product.orm-entity';
import { InvoiceItemOrmEntity } from '../invoices/infrastructure/persistence/entities/invoice-item.orm-entity';
import { UsersModule } from '../users/users.module';
import { UserOrmEntity } from '../users/infrastructure/persistence/entities/user.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    ClientOrmEntity, 
    InvoiceOrmEntity, 
    ProductOrmEntity, 
    InvoiceItemOrmEntity,
    UserOrmEntity
  ]),
  UsersModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientOrmEntity } from './infrastructure/client.orm-entity';
import { TypeOrmClientRepository } from './infrastructure/typeorm-client.repository';
import { ClientRepository } from './domain/client.repository';
import { ClientsController } from './clients.controller';
import { CreateClientUseCase } from './application/create-client.use-case';
import { FindAllClientsUseCase } from './application/find-all-clients.use-case';
import { FindClientUseCase } from './application/find-client.use-case';
import { UpdateClientUseCase } from './application/update-client.use-case';
import { DeleteClientUseCase } from './application/delete-client.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([ClientOrmEntity])],
  controllers: [ClientsController],
  providers: [
    { provide: ClientRepository, useClass: TypeOrmClientRepository },
    CreateClientUseCase,
    FindAllClientsUseCase,
    FindClientUseCase,
    UpdateClientUseCase,
    DeleteClientUseCase,
  ],
})
export class ClientsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Infrastructure — Persistence
import { ClientOrmEntity } from './infrastructure/persistence/entities/client.orm-entity';
import { ClientRepository } from './infrastructure/persistence/repositories/client.repository';

// Infrastructure — Messaging
import { ClientEventConsumer } from './infrastructure/messaging/consumers/client-event.consumer';
import { ClientEventPublisher } from './infrastructure/messaging/publishers/client-event.publisher';

// Domain
import { IClientRepository, CLIENT_REPOSITORY } from './domain/repositories/client.repository.interface';

// Application — Ports (output)
import { ClientEventPublisherPort } from './application/ports/output/client-event-publisher.port';

// Application — Use Cases
import { CreateClientUseCase } from './application/use-cases/create-client.use-case';
import { UpdateClientUseCase } from './application/use-cases/update-client.use-case';
import { DeleteClientUseCase } from './application/use-cases/delete-client.use-case';
import { GetClientUseCase } from './application/use-cases/get-client.use-case';
import { ListClientsUseCase } from './application/use-cases/list-clients.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([ClientOrmEntity])],
  controllers: [ClientEventConsumer],
  providers: [
    // Bind domain repository interface → infrastructure implementation
    { provide: CLIENT_REPOSITORY, useClass: ClientRepository },
    // Bind output port → infrastructure implementation
    { provide: ClientEventPublisherPort, useClass: ClientEventPublisher },
    // Use Cases
    CreateClientUseCase,
    UpdateClientUseCase,
    DeleteClientUseCase,
    GetClientUseCase,
    ListClientsUseCase,
  ],
})
export class ClientsModule {}

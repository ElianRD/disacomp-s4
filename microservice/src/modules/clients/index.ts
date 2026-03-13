// Public API of the clients module
export { ClientsModule } from './clients.module';
export { Client } from './domain/entities/client.entity';
export type { IClientRepository } from './domain/repositories/client.repository.interface';
export { CLIENT_REPOSITORY } from './domain/repositories/client.repository.interface';
export { ClientResponseDto } from './application/dtos/client-response.dto';

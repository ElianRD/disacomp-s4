import { Client } from './client.entity';

export abstract class ClientRepository {
  abstract save(client: Client): Promise<void>;
  abstract findAll(): Promise<Client[]>;
  abstract findById(id: string): Promise<Client | null>;
  abstract update(client: Client): Promise<void>;
  abstract delete(id: string): Promise<void>;
}

import { Client } from '../entities/client.entity';
import { ClientId } from '../value-objects/client-id.vo';
import { Rnc } from '../value-objects/rnc.vo';

export interface IClientRepository {
  save(client: Client): Promise<void>;
  findAll(): Promise<Client[]>;
  findById(id: ClientId): Promise<Client | null>;
  findByRnc(rnc: Rnc): Promise<Client | null>;
  update(client: Client): Promise<void>;
  delete(id: ClientId): Promise<void>;
}

export const CLIENT_REPOSITORY = 'CLIENT_REPOSITORY';

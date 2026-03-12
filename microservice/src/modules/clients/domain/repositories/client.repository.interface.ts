import { Client } from '../entities/client.entity';
import { ClientId } from '../value-objects/client-id.vo';
import { Rnc } from '../value-objects/rnc.vo';

export abstract class IClientRepository {
  abstract save(client: Client): Promise<void>;
  abstract findAll(): Promise<Client[]>;
  abstract findById(id: ClientId): Promise<Client | null>;
  abstract findByRnc(rnc: Rnc): Promise<Client | null>;
  abstract update(client: Client): Promise<void>;
  abstract delete(id: ClientId): Promise<void>;
}

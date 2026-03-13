import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IClientRepository } from '../../../domain/repositories/client.repository.interface';
import { Client } from '../../../domain/entities/client.entity';
import { ClientId } from '../../../domain/value-objects/client-id.vo';
import { Rnc } from '../../../domain/value-objects/rnc.vo';
import { ClientOrmEntity } from '../entities/client.orm-entity';
import { ClientPersistenceMapper } from '../mappers/client-persistence.mapper';

@Injectable()
export class ClientRepository implements IClientRepository {
  constructor(
    @InjectRepository(ClientOrmEntity)
    private readonly repo: Repository<ClientOrmEntity>,
  ) {}

  async save(client: Client): Promise<void> {
    await this.repo.save(ClientPersistenceMapper.toOrm(client));
  }

  async findAll(): Promise<Client[]> {
    const entities = await this.repo.find();
    return entities.map(ClientPersistenceMapper.toDomain);
  }

  async findById(id: ClientId): Promise<Client | null> {
    const entity = await this.repo.findOneBy({ id: id.getValue() });
    if (!entity) return null;
    return ClientPersistenceMapper.toDomain(entity);
  }

  async findByRnc(rnc: Rnc): Promise<Client | null> {
    const entity = await this.repo.findOneBy({ rnc: rnc.getValue() });
    if (!entity) return null;
    return ClientPersistenceMapper.toDomain(entity);
  }

  async update(client: Client): Promise<void> {
    await this.repo.update(
      client.id.getValue(),
      ClientPersistenceMapper.toOrm(client),
    );
  }

  async delete(id: ClientId): Promise<void> {
    await this.repo.delete(id.getValue());
  }
}

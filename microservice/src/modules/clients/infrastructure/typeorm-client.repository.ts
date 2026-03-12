import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientRepository } from '../domain/client.repository';
import { Client } from '../domain/client.entity';
import { ClientOrmEntity } from './client.orm-entity';

@Injectable()
export class TypeOrmClientRepository extends ClientRepository {
  constructor(
    @InjectRepository(ClientOrmEntity)
    private readonly repo: Repository<ClientOrmEntity>,
  ) {
    super();
  }

  async save(client: Client): Promise<void> {
    await this.repo.save({
      id: client.id,
      nombre: client.nombre,
      rnc: client.rnc.getValue(),
      direccion: client.direccion,
      telefono: client.telefono,
    });
  }

  async findAll(): Promise<Client[]> {
    const entities = await this.repo.find();
    return entities.map((e) => Client.create(e));
  }

  async findById(id: string): Promise<Client | null> {
    const e = await this.repo.findOneBy({ id });
    if (!e) return null;
    return Client.create(e);
  }

  async update(client: Client): Promise<void> {
    await this.repo.update(client.id, {
      nombre: client.nombre,
      rnc: client.rnc.getValue(),
      direccion: client.direccion,
      telefono: client.telefono,
    });
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}

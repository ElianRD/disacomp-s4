import { Injectable } from '@nestjs/common';
import { ClientRepository } from '../domain/client.repository';
import { Client } from '../domain/client.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateClientUseCase {
  constructor(private readonly repo: ClientRepository) {}

  async execute(dto: {
    nombre: string;
    rnc: string;
    direccion: string;
    telefono: string;
  }): Promise<void> {
    const client = Client.create({ id: uuidv4(), ...dto });
    await this.repo.save(client);
  }
}

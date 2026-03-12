import { Injectable } from '@nestjs/common';
import { ClientRepository } from '../domain/client.repository';
import { Client } from '../domain/client.entity';

@Injectable()
export class FindAllClientsUseCase {
  constructor(private readonly repo: ClientRepository) {}

  async execute(): Promise<Client[]> {
    return this.repo.findAll();
  }
}

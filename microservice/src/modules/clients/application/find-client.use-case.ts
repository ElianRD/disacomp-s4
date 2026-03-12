import { Injectable } from '@nestjs/common';
import { ClientRepository } from '../domain/client.repository';
import { Client } from '../domain/client.entity';

@Injectable()
export class FindClientUseCase {
  constructor(private readonly repo: ClientRepository) {}

  async execute(id: string): Promise<Client | null> {
    return this.repo.findById(id);
  }
}

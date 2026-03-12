import { Injectable } from '@nestjs/common';
import { ClientRepository } from '../domain/client.repository';

@Injectable()
export class DeleteClientUseCase {
  constructor(private readonly repo: ClientRepository) {}

  async execute(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}

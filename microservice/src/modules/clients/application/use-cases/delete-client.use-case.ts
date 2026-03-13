import { Injectable, Inject } from '@nestjs/common';
import { DeleteClientPort } from '../ports/input/delete-client.port';
import { CLIENT_REPOSITORY } from '../../domain/repositories/client.repository.interface';
import type { IClientRepository } from '../../domain/repositories/client.repository.interface';
import { ClientId } from '../../domain/value-objects/client-id.vo';
import { ClientNotFoundException } from '../../domain/exceptions/client-not-found.exception';

@Injectable()
export class DeleteClientUseCase implements DeleteClientPort {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly repo: IClientRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const clientId = new ClientId(id);
    const client = await this.repo.findById(clientId);
    if (!client) throw new ClientNotFoundException(id);

    client.delete();
    await this.repo.delete(clientId);
  }
}

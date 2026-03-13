import { Injectable, Inject } from '@nestjs/common';
import { ClientResponseDto } from '../dtos/client-response.dto';
import { CLIENT_REPOSITORY } from '../../domain/repositories/client.repository.interface';
import type { IClientRepository } from '../../domain/repositories/client.repository.interface';
import { ClientApplicationMapper } from '../mappers/client-application.mapper';

@Injectable()
export class ListClientsUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly repo: IClientRepository,
  ) {}

  async execute(): Promise<ClientResponseDto[]> {
    const clients = await this.repo.findAll();
    return clients.map(ClientApplicationMapper.toResponse);
  }
}

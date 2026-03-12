import { Injectable } from '@nestjs/common';
import { ClientResponseDto } from '../dtos/client-response.dto';
import { IClientRepository } from '../../domain/repositories/client.repository.interface';
import { ClientApplicationMapper } from '../mappers/client-application.mapper';

@Injectable()
export class ListClientsUseCase {
  constructor(private readonly repo: IClientRepository) {}

  async execute(): Promise<ClientResponseDto[]> {
    const clients = await this.repo.findAll();
    return clients.map(ClientApplicationMapper.toResponse);
  }
}

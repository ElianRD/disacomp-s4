import { Injectable } from '@nestjs/common';
import { GetClientPort } from '../ports/input/get-client.port';
import { ClientResponseDto } from '../dtos/client-response.dto';
import { IClientRepository } from '../../domain/repositories/client.repository.interface';
import { ClientId } from '../../domain/value-objects/client-id.vo';
import { ClientNotFoundException } from '../../domain/exceptions/client-not-found.exception';
import { ClientApplicationMapper } from '../mappers/client-application.mapper';

@Injectable()
export class GetClientUseCase implements GetClientPort {
  constructor(private readonly repo: IClientRepository) {}

  async execute(id: string): Promise<ClientResponseDto> {
    const client = await this.repo.findById(new ClientId(id));
    if (!client) throw new ClientNotFoundException(id);
    return ClientApplicationMapper.toResponse(client);
  }
}

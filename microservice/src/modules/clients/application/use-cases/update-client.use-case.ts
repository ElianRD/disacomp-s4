import { Injectable } from '@nestjs/common';
import { UpdateClientPort } from '../ports/input/update-client.port';
import { UpdateClientDto } from '../dtos/update-client.dto';
import { ClientResponseDto } from '../dtos/client-response.dto';
import { IClientRepository } from '../../domain/repositories/client.repository.interface';
import { ClientId } from '../../domain/value-objects/client-id.vo';
import { ClientNotFoundException } from '../../domain/exceptions/client-not-found.exception';
import { ClientApplicationMapper } from '../mappers/client-application.mapper';

@Injectable()
export class UpdateClientUseCase implements UpdateClientPort {
  constructor(private readonly repo: IClientRepository) {}

  async execute(dto: UpdateClientDto): Promise<ClientResponseDto> {
    const client = await this.repo.findById(new ClientId(dto.id));
    if (!client) throw new ClientNotFoundException(dto.id);

    client.update(dto);
    await this.repo.update(client);
    return ClientApplicationMapper.toResponse(client);
  }
}

import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateClientPort } from '../ports/input/create-client.port';
import { CreateClientDto } from '../dtos/create-client.dto';
import { ClientResponseDto } from '../dtos/client-response.dto';
import { IClientRepository } from '../../domain/repositories/client.repository.interface';
import { Client } from '../../domain/entities/client.entity';
import { ClientId } from '../../domain/value-objects/client-id.vo';
import { Rnc } from '../../domain/value-objects/rnc.vo';
import { ClientAlreadyExistsException } from '../../domain/exceptions/client-already-exists.exception';
import { ClientApplicationMapper } from '../mappers/client-application.mapper';

@Injectable()
export class CreateClientUseCase implements CreateClientPort {
  constructor(private readonly repo: IClientRepository) {}

  async execute(dto: CreateClientDto): Promise<ClientResponseDto> {
    const existing = await this.repo.findByRnc(new Rnc(dto.rnc));
    if (existing) throw new ClientAlreadyExistsException(dto.rnc);

    const client = Client.create({ id: uuidv4(), ...dto });
    await this.repo.save(client);
    return ClientApplicationMapper.toResponse(client);
  }
}

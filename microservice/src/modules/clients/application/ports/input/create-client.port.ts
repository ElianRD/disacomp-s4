import { CreateClientDto } from '../../dtos/create-client.dto';
import { ClientResponseDto } from '../../dtos/client-response.dto';

// Input Port - define el contrato del caso de uso de creación
export abstract class CreateClientPort {
  abstract execute(dto: CreateClientDto): Promise<ClientResponseDto>;
}

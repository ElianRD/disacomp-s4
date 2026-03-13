import { UpdateClientDto } from '../../dtos/update-client.dto';
import { ClientResponseDto } from '../../dtos/client-response.dto';

export abstract class UpdateClientPort {
  abstract execute(dto: UpdateClientDto): Promise<ClientResponseDto>;
}

import { ClientResponseDto } from '../../dtos/client-response.dto';

export abstract class GetClientPort {
  abstract execute(id: string): Promise<ClientResponseDto>;
}

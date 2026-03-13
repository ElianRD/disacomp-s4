import { Client } from '../../domain/entities/client.entity';
import { ClientResponseDto } from '../dtos/client-response.dto';

export class ClientApplicationMapper {
  static toResponse(client: Client): ClientResponseDto {
    const dto = new ClientResponseDto();
    dto.id = client.id.getValue();
    dto.nombre = client.nombre;
    dto.rnc = client.rnc.getValue();
    dto.direccion = client.direccion;
    dto.telefono = client.telefono.getValue();
    return dto;
  }
}

import { Client } from '../../../domain/entities/client.entity';
import { ClientOrmEntity } from '../entities/client.orm-entity';

export class ClientPersistenceMapper {
  static toDomain(entity: ClientOrmEntity): Client {
    return Client.reconstitute({
      id: entity.id,
      nombre: entity.nombre,
      rnc: entity.rnc,
      direccion: entity.direccion,
      telefono: entity.telefono,
    });
  }

  static toOrm(client: Client): Partial<ClientOrmEntity> {
    return {
      id: client.id.getValue(),
      nombre: client.nombre,
      rnc: client.rnc.getValue(),
      direccion: client.direccion,
      telefono: client.telefono.getValue(),
    };
  }
}

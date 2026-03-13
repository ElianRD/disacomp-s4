import { Injectable } from '@nestjs/common';
import { ClientEventPublisherPort } from '../../../application/ports/output/client-event-publisher.port';

// Adaptador de salida: publica eventos de dominio de clientes
// En esta práctica se puede dejar como stub o implementar si se requiere
@Injectable()
export class ClientEventPublisher extends ClientEventPublisherPort {
  async publishCreated(event: object): Promise<void> {
    console.log('[ClientEventPublisher] client.created', event);
  }

  async publishUpdated(event: object): Promise<void> {
    console.log('[ClientEventPublisher] client.updated', event);
  }

  async publishDeleted(event: object): Promise<void> {
    console.log('[ClientEventPublisher] client.deleted', event);
  }
}

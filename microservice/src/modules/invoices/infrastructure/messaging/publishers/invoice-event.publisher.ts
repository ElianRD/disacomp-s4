import { Injectable } from '@nestjs/common';
import { IInvoiceEventPublisher } from '../../../application/ports/output/invoice-event-publisher.port';
import { InvoiceCreatedEvent } from '../../../domain/events/invoice-created.event';
import { InvoiceUpdatedEvent } from '../../../domain/events/invoice-updated.event';
import { InvoiceDeletedEvent } from '../../../domain/events/invoice-deleted.event';

@Injectable()
export class InvoiceEventPublisher implements IInvoiceEventPublisher {
  async publish(
    event: InvoiceCreatedEvent | InvoiceUpdatedEvent | InvoiceDeletedEvent,
  ): Promise<void> {
    // Aquí se conectaría con el ClientProxy de RabbitMQ para emitir el evento
    // Por ahora se loguea para que el módulo pueda compilar y funcionar
    console.log(`[InvoiceEvent] ${event.eventName}`, event);
  }
}

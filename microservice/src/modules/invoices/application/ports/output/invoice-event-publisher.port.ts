import { InvoiceCreatedEvent } from '../../../domain/events/invoice-created.event';
import { InvoiceUpdatedEvent } from '../../../domain/events/invoice-updated.event';
import { InvoiceDeletedEvent } from '../../../domain/events/invoice-deleted.event';

export interface IInvoiceEventPublisher {
  publish(event: InvoiceCreatedEvent | InvoiceUpdatedEvent | InvoiceDeletedEvent): Promise<void>;
}

export const INVOICE_EVENT_PUBLISHER = 'INVOICE_EVENT_PUBLISHER';

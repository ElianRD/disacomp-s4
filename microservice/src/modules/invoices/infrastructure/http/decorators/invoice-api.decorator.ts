import { applyDecorators, SetMetadata } from '@nestjs/common';

export const INVOICE_API_METADATA = 'invoice_api';

export const InvoiceApi = (...metadata: string[]) =>
  applyDecorators(SetMetadata(INVOICE_API_METADATA, metadata));
